# Data Management Feature

## Overview

The Data Management feature provides a comprehensive CSV upload and import system for player data in the Elevate platform. It allows administrators to bulk import player information from CSV files with validation, preview, and audit capabilities.

## Features

### 1. CSV Upload & Validation
- **File Upload**: Drag-and-drop or click-to-browse CSV file upload
- **Format Validation**: Ensures CSV files have the correct structure and required headers
- **Data Validation**: Validates individual records for data integrity and completeness
- **Template Download**: Provides a downloadable CSV template with correct headers

### 2. Import Preview
- **Data Preview**: Shows a summary of valid and invalid records before import
- **Conflict Detection**: Identifies existing players that would be updated
- **Error Reporting**: Detailed error messages for invalid records
- **Statistics Dashboard**: Visual representation of import statistics

### 3. Advanced Import Options
- **Update Existing**: Option to update existing player records
- **Skip Duplicates**: Option to skip duplicate records
- **Validate Only**: Preview mode without actual import
- **Create Missing Fields**: Automatically create missing database fields

### 4. Audit & History
- **Import History**: Track all import operations with timestamps
- **Audit Logs**: Detailed logs of created, updated, and error records
- **User Tracking**: Track which admin performed each import
- **Performance Metrics**: Import duration and success rates

## Technical Implementation

### Components

#### DataManagement.tsx
Main component handling the CSV upload workflow:
- File upload interface
- Import preview and validation
- Progress tracking
- Results display

#### DataImportService.ts
Service layer for database operations:
- CSV data processing
- Database insert/update operations
- Audit log management
- Error handling

### Database Schema

#### import_audit_logs Table
```sql
CREATE TABLE import_audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    file_name TEXT NOT NULL,
    records_processed INTEGER NOT NULL DEFAULT 0,
    records_created INTEGER NOT NULL DEFAULT 0,
    records_updated INTEGER NOT NULL DEFAULT 0,
    records_with_errors INTEGER NOT NULL DEFAULT 0,
    admin_user TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### CSV Format Requirements

#### Required Headers
```
Full Name,Jersey Number,Date of Birth,Primary Position,Parent/Guardian 1 Full Name,Parent/Guardian 1 Phone,Parent/Guardian 1 Email,Parent/Guardian 2 Full Name,Parent/Guardian 2 Phone,Parent/Guardian 2 Email,Emergency Contact Name,Emergency Contact Phone,Medical Notes/Allergies
```

#### Data Validation Rules
- **Full Name**: Required, non-empty string
- **Jersey Number**: Required, integer between 1-999
- **Date of Birth**: Required, valid date in YYYY-MM-DD format
- **Primary Position**: Required, non-empty string
- **Parent/Guardian 1**: Required name, phone, and email
- **Emergency Contact**: Required name and phone number
- **Optional Fields**: Parent/Guardian 2 information and medical notes

## Usage Guide

### Step 1: Prepare CSV File
1. Download the CSV template from the Data Management page
2. Fill in player information following the template format
3. Ensure all required fields are completed
4. Save as CSV format

### Step 2: Upload File
1. Navigate to Team Portal → Data Management
2. Click "Upload CSV File" or drag-and-drop your file
3. Wait for validation to complete

### Step 3: Review Preview
1. Check the import statistics
2. Review any validation errors
3. Confirm new vs. existing player counts
4. Adjust import options if needed

### Step 4: Execute Import
1. Click "Import Data" to proceed
2. Monitor the import progress
3. Review the final results
4. Check the import history for audit trail

## Error Handling

### Common Validation Errors
- **Missing Required Fields**: Ensure all required headers and data are present
- **Invalid Date Format**: Use YYYY-MM-DD format for dates
- **Invalid Phone Numbers**: Use standard phone number format
- **Invalid Email Addresses**: Ensure proper email format
- **Jersey Number Range**: Must be between 1-999

### Import Failures
- **Database Connection**: Check network connectivity
- **Permission Issues**: Ensure proper database permissions
- **Duplicate Constraints**: Handle duplicate jersey numbers or names
- **Data Type Mismatches**: Ensure data matches expected types

## Security & Permissions

### Row Level Security (RLS)
- Only authenticated users can access import functionality
- Audit logs are protected by RLS policies
- User actions are tracked for accountability

### Data Validation
- Input sanitization prevents injection attacks
- File size limits prevent resource exhaustion
- File type validation ensures only CSV files are processed

## Performance Considerations

### Optimization Features
- **Batch Processing**: Efficient bulk database operations
- **Indexed Queries**: Optimized database queries with proper indexing
- **Memory Management**: Streamlined file processing to minimize memory usage
- **Progress Tracking**: Real-time feedback during long operations

### Scalability
- **Large File Support**: Handles files with thousands of records
- **Incremental Processing**: Processes records in batches
- **Error Recovery**: Continues processing even if some records fail

## Integration Points

### Player Grid
- Imported players automatically appear in the Player Grid
- Progress tracking updates reflect new player data
- Real-time refresh after successful imports

### Team Portal
- Integrated into the main navigation
- Consistent UI/UX with other portal features
- Seamless workflow integration

### System Dashboard
- Import statistics visible in system overview
- Audit trail accessible from dashboard
- Performance metrics integration

## Future Enhancements

### Planned Features
- **Excel Support**: Import from Excel (.xlsx) files
- **API Integration**: REST API for programmatic imports
- **Scheduled Imports**: Automated import scheduling
- **Data Mapping**: Custom field mapping for different CSV formats
- **Bulk Export**: Export player data to various formats
- **Data Sync**: Real-time synchronization with external systems

### Advanced Analytics
- **Import Trends**: Historical import pattern analysis
- **Data Quality Metrics**: Automated data quality scoring
- **Duplicate Detection**: Advanced duplicate identification algorithms
- **Data Enrichment**: Automatic data enhancement from external sources

## Troubleshooting

### Common Issues
1. **File Not Uploading**: Check file size and format
2. **Validation Errors**: Review CSV format and required fields
3. **Import Failures**: Check database connectivity and permissions
4. **Performance Issues**: Consider file size and record count

### Support Resources
- CSV template with example data
- Detailed error messages and validation rules
- Import history for troubleshooting
- System logs for technical issues

## API Reference

### DataImportService Methods

#### importPlayerData()
```typescript
static async importPlayerData(
  csvData: CSVPlayerData[],
  existingPlayers: Player[],
  options: ImportOptions
): Promise<ImportResult>
```

#### getAuditLogs()
```typescript
static async getAuditLogs(limit: number = 50): Promise<ImportAuditLog[]>
```

#### getExistingPlayers()
```typescript
static async getExistingPlayers(): Promise<Player[]>
```

### Types

#### ImportOptions
```typescript
interface ImportOptions {
  updateExisting: boolean;
  skipDuplicates: boolean;
  validateOnly: boolean;
  createMissingFields: boolean;
  adminUser: string;
}
```

#### ImportResult
```typescript
interface ImportResult {
  success: boolean;
  importedPlayers: Player[];
  errors: string[];
  auditLog: ImportAuditLog;
}
```

## Conclusion

The Data Management feature provides a robust, secure, and user-friendly solution for bulk player data import. With comprehensive validation, audit trails, and error handling, it ensures data integrity while maintaining system performance and security. 