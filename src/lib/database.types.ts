export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players_first_class: {
        Row: {
          id: string
          name: string
          jersey_number: number
          team: string | null
          position: string | null
          primary_position: string | null
          date_of_birth: string | null
          created_at: string
          last_updated: string
          medical_notes: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
        Insert: {
          id?: string
          name: string
          jersey_number: number
          team?: string | null
          position?: string | null
          primary_position?: string | null
          date_of_birth?: string | null
          created_at?: string
          last_updated?: string
          medical_notes?: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
        Update: {
          id?: string
          name?: string
          jersey_number?: number
          team?: string | null
          position?: string | null
          primary_position?: string | null
          date_of_birth?: string | null
          created_at?: string
          last_updated?: string
          medical_notes?: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
      }
      player_contacts: {
        Row: {
          id: string
          player_id: string
          contact_type: 'parent1' | 'parent2' | 'emergency'
          full_name: string
          phone_number: string
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          contact_type: 'parent1' | 'parent2' | 'emergency'
          full_name: string
          phone_number: string
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          contact_type?: 'parent1' | 'parent2' | 'emergency'
          full_name?: string
          phone_number?: string
          email?: string | null
          created_at?: string
        }
      }
      player_photos: {
        Row: {
          id: string
          player_id: string
          url: string
          original_name: string
          upload_date: string
          size: number
          width: number
          height: number
          ai_confidence: number
        }
        Insert: {
          id?: string
          player_id: string
          url: string
          original_name: string
          upload_date?: string
          size?: number
          width?: number
          height?: number
          ai_confidence?: number
        }
        Update: {
          id?: string
          player_id?: string
          url?: string
          original_name?: string
          upload_date?: string
          size?: number
          width?: number
          height?: number
          ai_confidence?: number
        }
      }
      import_audit_logs: {
        Row: {
          id: string
          timestamp: string
          file_name: string
          records_processed: number
          records_created: number
          records_updated: number
          records_with_errors: number
          admin_user: string
          summary: string | null
          created_at: string
        }
        Insert: {
          id?: string
          timestamp?: string
          file_name: string
          records_processed?: number
          records_created?: number
          records_updated?: number
          records_with_errors?: number
          admin_user: string
          summary?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          timestamp?: string
          file_name?: string
          records_processed?: number
          records_created?: number
          records_updated?: number
          records_with_errors?: number
          admin_user?: string
          summary?: string | null
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          jersey_number: number
          team: string | null
          position: string | null
          primary_position: string | null
          date_of_birth: string | null
          created_at: string
          last_updated: string
          medical_notes: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
        Insert: {
          id?: string
          name: string
          jersey_number: number
          team?: string | null
          position?: string | null
          primary_position?: string | null
          date_of_birth?: string | null
          created_at?: string
          last_updated?: string
          medical_notes?: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
        Update: {
          id?: string
          name?: string
          jersey_number?: number
          team?: string | null
          position?: string | null
          primary_position?: string | null
          date_of_birth?: string | null
          created_at?: string
          last_updated?: string
          medical_notes?: string | null
          'Graduation Year'?: number
          'Email'?: string
          'Phone Number'?: string
          'ParentGuardian Name'?: string
        }
      }
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          title: string | null;
          profile_photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          title?: string | null;
          profile_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          title?: string | null;
          profile_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      session_logs: {
        Row: {
          id: string;
          user_id: string | null;
          session_type: 'user' | 'ai' | 'system' | 'integration' | 'automated';
          start_time: string;
          end_time: string | null;
          context: Json;
          actions: Json;
          outcome: 'success' | 'error' | 'timeout' | 'abandoned' | 'in_progress' | null;
          error_details: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_type: 'user' | 'ai' | 'system' | 'integration' | 'automated';
          start_time?: string;
          end_time?: string | null;
          context?: Json;
          actions?: Json;
          outcome?: 'success' | 'error' | 'timeout' | 'abandoned' | 'in_progress' | null;
          error_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_type?: 'user' | 'ai' | 'system' | 'integration' | 'automated';
          start_time?: string;
          end_time?: string | null;
          context?: Json;
          actions?: Json;
          outcome?: 'success' | 'error' | 'timeout' | 'abandoned' | 'in_progress' | null;
          error_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      decision_logs: {
        Row: {
          id: string;
          session_id: string | null;
          user_id: string | null;
          timestamp: string;
          decision_type: 'user' | 'ai' | 'system' | 'governance' | 'automated';
          context: Json;
          request: string;
          response: string;
          implementation: string | null;
          impact: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          user_id?: string | null;
          timestamp?: string;
          decision_type: 'user' | 'ai' | 'system' | 'governance' | 'automated';
          context?: Json;
          request: string;
          response: string;
          implementation?: string | null;
          impact?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          user_id?: string | null;
          timestamp?: string;
          decision_type?: 'user' | 'ai' | 'system' | 'governance' | 'automated';
          context?: Json;
          request?: string;
          response?: string;
          implementation?: string | null;
          impact?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      system_events: {
        Row: {
          id: string;
          event_type: 'error' | 'deployment' | 'feature_toggle' | 'audit' | 'security' | 'performance' | 'user_action';
          timestamp: string;
          user_id: string | null;
          session_id: string | null;
          details: Json;
          severity: 'info' | 'warning' | 'error' | 'critical';
          related_feature: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_type: 'error' | 'deployment' | 'feature_toggle' | 'audit' | 'security' | 'performance' | 'user_action';
          timestamp?: string;
          user_id?: string | null;
          session_id?: string | null;
          details?: Json;
          severity: 'info' | 'warning' | 'error' | 'critical';
          related_feature?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_type?: 'error' | 'deployment' | 'feature_toggle' | 'audit' | 'security' | 'performance' | 'user_action';
          timestamp?: string;
          user_id?: string | null;
          session_id?: string | null;
          details?: Json;
          severity?: 'info' | 'warning' | 'error' | 'critical';
          related_feature?: string | null;
          created_at?: string;
        };
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}