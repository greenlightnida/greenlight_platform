import { supabase } from '../../lib/supabase';

export interface SupabaseTable {
  name: string;
  columns: {
    name: string;
    type: string;
    is_nullable: boolean;
    default_value?: string;
    is_primary_key?: boolean;
  }[];
  row_count?: number;
  size?: string;
}

export interface SupabaseFunction {
  name: string;
  schema: string;
  language: string;
  return_type: string;
  parameters: {
    name: string;
    type: string;
    default_value?: string;
  }[];
  definition?: string;
}

export interface SupabaseStorageBucket {
  name: string;
  public: boolean;
  file_size_limit: string;
  allowed_mime_types?: string[];
  file_count?: number;
  total_size?: string;
}

export interface SupabaseSchema {
  tables: SupabaseTable[];
  functions: SupabaseFunction[];
  storage: SupabaseStorageBucket[];
  lastUpdated: string;
}

export class SupabaseSchemaService {
  
  /**
   * Fetch live database schema from Supabase
   */
  static async getLiveSchema(): Promise<SupabaseSchema> {
    try {
      const [tables, functions, storage] = await Promise.all([
        this.getTables(),
        this.getFunctions(),
        this.getStorageBuckets()
      ]);

      return {
        tables,
        functions,
        storage,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching Supabase schema:', error);
      throw new Error('Failed to fetch database schema');
    }
  }

  /**
   * Get all tables with their column information
   */
  private static async getTables(): Promise<SupabaseTable[]> {
    try {
      // Query information_schema for table details
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .not('table_name', 'like', 'pg_%')
        .not('table_name', 'like', 'information_schema%');

      if (error) throw error;

      const tableDetails: SupabaseTable[] = [];

      for (const table of tables || []) {
        const tableName = table.table_name;
        
        // Get column information (simplified query)
        const { data: columns, error: columnError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_name', tableName)
          .eq('table_schema', 'public');

        if (columnError) {
          console.warn(`Error fetching columns for table ${tableName}:`, columnError);
          continue;
        }

        // Get row count (approximate)
        const { count: rowCount } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        tableDetails.push({
          name: tableName,
          columns: (columns as any[]).map((col: any) => ({
            name: col.column_name,
            type: col.data_type,
            is_nullable: col.is_nullable === 'YES',
            default_value: col.column_default,
            is_primary_key: false // Simplified for now
          })) || [],
          row_count: rowCount || 0
        });
      }

      return tableDetails;
    } catch (error) {
      console.error('Error fetching tables:', error);
      return [];
    }
  }

  /**
   * Get all database functions
   */
  private static async getFunctions(): Promise<SupabaseFunction[]> {
    try {
      const { data: functions, error } = await supabase
        .from('information_schema.routines')
        .select(`
          routine_name,
          routine_schema,
          routine_type,
          data_type,
          routine_definition
        `)
        .eq('routine_schema', 'public')
        .eq('routine_type', 'FUNCTION');

      if (error) throw error;

      const functionDetails: SupabaseFunction[] = [];

      for (const func of functions || []) {
        // Get function parameters
        const { data: parameters, error: paramError } = await supabase
          .from('information_schema.parameters')
          .select(`
            parameter_name,
            data_type,
            parameter_default
          `)
          .eq('specific_name', func.routine_name)
          .eq('parameter_schema', 'public')
          .not('parameter_name', 'is', null);

        if (paramError) {
          console.warn(`Error fetching parameters for function ${func.routine_name}:`, paramError);
        }

        functionDetails.push({
          name: func.routine_name,
          schema: func.routine_schema,
          language: 'sql', // Most Supabase functions are SQL
          return_type: func.data_type,
          parameters: (parameters as any[]).map((param: any) => ({
            name: param.parameter_name,
            type: param.data_type,
            default_value: param.parameter_default
          })) || [],
          definition: func.routine_definition
        });
      }

      return functionDetails;
    } catch (error) {
      console.error('Error fetching functions:', error);
      return [];
    }
  }

  /**
   * Get storage bucket information
   */
  private static async getStorageBuckets(): Promise<SupabaseStorageBucket[]> {
    try {
      // Note: This requires admin privileges or specific storage policies
      // For now, we'll return a mock implementation that can be enhanced
      const { data: buckets, error } = await supabase.storage.listBuckets();

      if (error) {
        console.warn('Error fetching storage buckets:', error);
        // Return mock data for development
        return this.getMockStorageBuckets();
      }

      const bucketDetails: SupabaseStorageBucket[] = [];

      for (const bucket of buckets || []) {
        // Get bucket details
        const { data: files } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 1 });

        bucketDetails.push({
          name: bucket.name,
          public: bucket.public || false,
          file_size_limit: String(bucket.file_size_limit || '50MB'),
          file_count: files?.length || 0,
          total_size: 'Unknown' // Would need additional API calls to calculate
        });
      }

      return bucketDetails;
    } catch (error) {
      console.error('Error fetching storage buckets:', error);
      return this.getMockStorageBuckets();
    }
  }

  /**
   * Mock storage buckets for development/testing
   */
  private static getMockStorageBuckets(): SupabaseStorageBucket[] {
    return [
      {
        name: 'player-photos',
        public: true,
        file_size_limit: '50MB',
        file_count: 150,
        total_size: '2.3GB'
      },
      {
        name: 'team-media',
        public: false,
        file_size_limit: '100MB',
        file_count: 75,
        total_size: '1.8GB'
      },
      {
        name: 'documentation',
        public: true,
        file_size_limit: '10MB',
        file_count: 25,
        total_size: '150MB'
      },
      {
        name: 'attachments',
        public: false,
        file_size_limit: '25MB',
        file_count: 45,
        total_size: '800MB'
      }
    ];
  }

  /**
   * Get table usage statistics
   * @param tableName
   */
  static async getTableUsage(tableName: string): Promise<{
    rowCount: number;
    size: string;
    lastModified: string;
    accessCount?: number;
  }> {
    try {
      const { count: rowCount } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      // Get last modified timestamp (if table has updated_at column)
      const { data: lastRecord } = await supabase
        .from(tableName)
        .select('updated_at, created_at')
        .order('updated_at', { ascending: false })
        .limit(1);

      return {
        rowCount: rowCount || 0,
        size: 'Unknown', // Would need pg_size_pretty() query
        lastModified: lastRecord?.[0]?.updated_at || lastRecord?.[0]?.created_at || 'Unknown'
      };
    } catch (error) {
      console.error(`Error fetching usage for table ${tableName}:`, error);
      return {
        rowCount: 0,
        size: 'Unknown',
        lastModified: 'Unknown'
      };
    }
  }

  /**
   * Check if a table exists and is accessible
   * @param tableName
   */
  static async tableExists(tableName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', tableName)
        .eq('table_schema', 'public')
        .limit(1);

      return !error && (data.length || 0) > 0;
    } catch (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
  }

  /**
   * Get table relationships (foreign keys)
   * @param tableName
   */
  static async getTableRelationships(tableName: string): Promise<{
    foreignKeys: Array<{
      column: string;
      referencesTable: string;
      referencesColumn: string;
    }>;
    referencedBy: Array<{
      table: string;
      column: string;
    }>;
  }> {
    try {
      // Get foreign keys from this table
      const { data: foreignKeys } = await supabase
        .from('information_schema.key_column_usage')
        .select(`
          column_name,
          referenced_table_name,
          referenced_column_name
        `)
        .eq('table_name', tableName)
        .eq('table_schema', 'public')
        .not('referenced_table_name', 'is', null);

      // Get tables that reference this table
      const { data: referencedBy } = await supabase
        .from('information_schema.key_column_usage')
        .select(`
          table_name,
          column_name
        `)
        .eq('referenced_table_name', tableName)
        .eq('table_schema', 'public');

      return {
        foreignKeys: (foreignKeys as any[]).map((fk: any) => ({
          column: fk.column_name,
          referencesTable: fk.referenced_table_name,
          referencesColumn: fk.referenced_column_name
        })) || [],
        referencedBy: (referencedBy as any[]).map((ref: any) => ({
          table: ref.table_name,
          column: ref.column_name
        })) || []
      };
    } catch (error) {
      console.error(`Error fetching relationships for table ${tableName}:`, error);
      return { foreignKeys: [], referencedBy: [] };
    }
  }
} 