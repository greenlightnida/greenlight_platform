/**
 * Data Backup Utility for Data Holon
 * 
 * PURPOSE: Create, manage, and restore data backups
 * - Incremental backups
 * - Version control
 * - Compression
 * - Restoration capabilities
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface BackupConfig {
  sourceDirectories: string[];
  excludePatterns: string[];
  compressionLevel: number;
  maxBackups: number;
  backupDirectory: string;
}

interface BackupMetadata {
  id: string;
  timestamp: string;
  version: string;
  size: number;
  compressedSize: number;
  fileCount: number;
  checksum: string;
  sourceDirectories: string[];
  description?: string;
}

interface BackupInfo {
  metadata: BackupMetadata;
  filePath: string;
  exists: boolean;
  canRestore: boolean;
}

export class DataBackupManager {
  private config: BackupConfig;
  private backupDir: string;

  constructor(config?: Partial<BackupConfig>) {
    this.config = {
      sourceDirectories: ['data', 'config', 'docs'],
      excludePatterns: ['node_modules', 'dist', 'build', '.git', '*.log', '*.tmp'],
      compressionLevel: 6,
      maxBackups: 10,
      backupDirectory: 'backup/data-holon',
      ...config
    };
    
    this.backupDir = this.config.backupDirectory;
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup(description?: string): Promise<BackupMetadata> {
    const backupId = `backup-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    console.log(`🔄 Creating backup: ${backupId}`);
    console.log(`📁 Source directories: ${this.config.sourceDirectories.join(', ')}`);
    
    const backupPath = path.join(this.backupDir, `${backupId}.tar.gz`);
    const tempDir = path.join(this.backupDir, 'temp', backupId);
    
    try {
      // Create temporary directory
      fs.mkdirSync(tempDir, { recursive: true });
      
      // Copy files to temp directory
      let totalSize = 0;
      let fileCount = 0;
      
      for (const sourceDir of this.config.sourceDirectories) {
        if (fs.existsSync(sourceDir)) {
          const size = await this.copyDirectory(sourceDir, path.join(tempDir, sourceDir));
          totalSize += size.size;
          fileCount += size.count;
        }
      }
      
      // Create compressed archive
      console.log('🗜️  Creating compressed archive...');
      const compressedSize = await this.createCompressedArchive(tempDir, backupPath);
      
      // Calculate checksum
      const checksum = await this.calculateChecksum(backupPath);
      
      // Create metadata
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp,
        version: '1.0.0',
        size: totalSize,
        compressedSize,
        fileCount,
        checksum,
        sourceDirectories: this.config.sourceDirectories,
        description
      };
      
      // Save metadata
      const metadataPath = path.join(this.backupDir, `${backupId}.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      // Clean up temp directory
      fs.rmSync(tempDir, { recursive: true, force: true });
      
      console.log(`✅ Backup created successfully: ${backupId}`);
      console.log(`   Size: ${this.formatBytes(totalSize)} (compressed: ${this.formatBytes(compressedSize)})`);
      console.log(`   Files: ${fileCount}`);
      console.log(`   Checksum: ${checksum}`);
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      return metadata;
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      
      // Clean up on failure
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
      
      throw error;
    }
  }

  private async copyDirectory(source: string, destination: string): Promise<{ size: number; count: number }> {
    let totalSize = 0;
    let fileCount = 0;
    
    const copyRecursive = (src: string, dest: string) => {
      const stat = fs.statSync(src);
      
      if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const items = fs.readdirSync(src);
        for (const item of items) {
          const srcPath = path.join(src, item);
          const destPath = path.join(dest, item);
          
          // Check exclude patterns
          const shouldExclude = this.config.excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
              const regex = new RegExp(pattern.replace(/\*/g, '.*'));
              return regex.test(item);
            }
            return srcPath.includes(pattern);
          });
          
          if (!shouldExclude) {
            copyRecursive(srcPath, destPath);
          }
        }
      } else if (stat.isFile()) {
        fs.copyFileSync(src, dest);
        totalSize += stat.size;
        fileCount++;
      }
    };
    
    copyRecursive(source, destination);
    return { size: totalSize, count: fileCount };
  }

  private async createCompressedArchive(sourceDir: string, outputPath: string): Promise<number> {
    try {
      // Use tar command for compression
      const command = `tar -czf "${outputPath}" -C "${path.dirname(sourceDir)}" "${path.basename(sourceDir)}"`;
      execSync(command, { stdio: 'pipe' });
      
      const stat = fs.statSync(outputPath);
      return stat.size;
    } catch (error) {
      console.error('❌ Compression failed:', error);
      throw error;
    }
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    try {
      const command = `shasum -a 256 "${filePath}"`;
      const output = execSync(command, { encoding: 'utf8' });
      return output.split(' ')[0];
    } catch (error) {
      console.error('❌ Checksum calculation failed:', error);
      return 'unknown';
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async listBackups(): Promise<BackupInfo[]> {
    const backups: BackupInfo[] = [];
    
    if (!fs.existsSync(this.backupDir)) {
      return backups;
    }
    
    const files = fs.readdirSync(this.backupDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const backupId = file.replace('.json', '');
        const metadataPath = path.join(this.backupDir, file);
        const backupPath = path.join(this.backupDir, `${backupId}.tar.gz`);
        
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          const metadata: BackupMetadata = JSON.parse(metadataContent);
          
          const exists = fs.existsSync(backupPath);
          const canRestore = exists && await this.verifyBackup(backupPath, metadata.checksum);
          
          backups.push({
            metadata,
            filePath: backupPath,
            exists,
            canRestore
          });
        } catch (error) {
          console.warn(`Warning: Could not read backup metadata for ${file}:`, error);
        }
      }
    }
    
    // Sort by timestamp (newest first)
    backups.sort((a, b) => new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime());
    
    return backups;
  }

  private async verifyBackup(backupPath: string, expectedChecksum: string): Promise<boolean> {
    try {
      const actualChecksum = await this.calculateChecksum(backupPath);
      return actualChecksum === expectedChecksum;
    } catch {
      return false;
    }
  }

  async restoreBackup(backupId: string, targetDirectory: string = '.'): Promise<void> {
    console.log(`🔄 Restoring backup: ${backupId}`);
    
    const backupPath = path.join(this.backupDir, `${backupId}.tar.gz`);
    const metadataPath = path.join(this.backupDir, `${backupId}.json`);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup file not found: ${backupPath}`);
    }
    
    if (!fs.existsSync(metadataPath)) {
      throw new Error(`Backup metadata not found: ${metadataPath}`);
    }
    
    try {
      // Read metadata
      const metadataContent = fs.readFileSync(metadataPath, 'utf8');
      const metadata: BackupMetadata = JSON.parse(metadataContent);
      
      // Verify checksum
      const checksumValid = await this.verifyBackup(backupPath, metadata.checksum);
      if (!checksumValid) {
        throw new Error('Backup checksum verification failed');
      }
      
      // Create restore directory
      const restoreDir = path.join(targetDirectory, `restore-${backupId}`);
      if (fs.existsSync(restoreDir)) {
        fs.rmSync(restoreDir, { recursive: true, force: true });
      }
      fs.mkdirSync(restoreDir, { recursive: true });
      
      // Extract backup
      console.log('📦 Extracting backup...');
      const command = `tar -xzf "${backupPath}" -C "${restoreDir}"`;
      execSync(command, { stdio: 'pipe' });
      
      // Restore files
      console.log('🔄 Restoring files...');
      for (const sourceDir of metadata.sourceDirectories) {
        const sourcePath = path.join(restoreDir, sourceDir);
        const targetPath = path.join(targetDirectory, sourceDir);
        
        if (fs.existsSync(sourcePath)) {
          if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
          }
          fs.renameSync(sourcePath, targetPath);
        }
      }
      
      // Clean up restore directory
      fs.rmSync(restoreDir, { recursive: true, force: true });
      
      console.log(`✅ Backup restored successfully: ${backupId}`);
      console.log(`   Restored ${metadata.fileCount} files`);
      console.log(`   Total size: ${this.formatBytes(metadata.size)}`);
    } catch (error) {
      console.error('❌ Backup restoration failed:', error);
      throw error;
    }
  }

  async deleteBackup(backupId: string): Promise<void> {
    console.log(`🗑️  Deleting backup: ${backupId}`);
    
    const backupPath = path.join(this.backupDir, `${backupId}.tar.gz`);
    const metadataPath = path.join(this.backupDir, `${backupId}.json`);
    
    try {
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
      
      if (fs.existsSync(metadataPath)) {
        fs.unlinkSync(metadataPath);
      }
      
      console.log(`✅ Backup deleted: ${backupId}`);
    } catch (error) {
      console.error('❌ Failed to delete backup:', error);
      throw error;
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    const backups = await this.listBackups();
    
    if (backups.length > this.config.maxBackups) {
      const toDelete = backups.slice(this.config.maxBackups);
      
      console.log(`🧹 Cleaning up ${toDelete.length} old backups...`);
      
      for (const backup of toDelete) {
        await this.deleteBackup(backup.metadata.id);
      }
    }
  }

  printBackupList(backups: BackupInfo[]): void {
    console.log('\n📋 BACKUP LIST');
    console.log('='.repeat(80));
    
    if (backups.length === 0) {
      console.log('No backups found.');
      return;
    }
    
    backups.forEach((backup, index) => {
      const status = backup.canRestore ? '✅' : backup.exists ? '⚠️' : '❌';
      const size = backup.metadata.compressedSize ? 
        this.formatBytes(backup.metadata.compressedSize) : 'unknown';
      
      console.log(`${index + 1}. ${status} ${backup.metadata.id}`);
      console.log(`   Date: ${backup.metadata.timestamp}`);
      console.log(`   Size: ${size} (${backup.metadata.fileCount} files)`);
      if (backup.metadata.description) {
        console.log(`   Description: ${backup.metadata.description}`);
      }
      console.log('');
    });
  }

  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    averageSize: number;
    oldestBackup: string;
    newestBackup: string;
  }> {
    const backups = await this.listBackups();
    
    if (backups.length === 0) {
      return {
        totalBackups: 0,
        totalSize: 0,
        averageSize: 0,
        oldestBackup: 'none',
        newestBackup: 'none'
      };
    }
    
    const totalSize = backups.reduce((sum, backup) => sum + backup.metadata.compressedSize, 0);
    const timestamps = backups.map(b => b.metadata.timestamp).sort();
    
    return {
      totalBackups: backups.length,
      totalSize,
      averageSize: totalSize / backups.length,
      oldestBackup: timestamps[0],
      newestBackup: timestamps[timestamps.length - 1]
    };
  }
}

// CLI interface for direct usage
if (require.main === module) {
  const backupManager = new DataBackupManager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      switch (command) {
        case 'create':
          const description = args[1];
          await backupManager.createBackup(description);
          break;
          
        case 'list':
          const backups = await backupManager.listBackups();
          backupManager.printBackupList(backups);
          break;
          
        case 'restore':
          const backupId = args[1];
          const targetDir = args[2] || '.';
          if (!backupId) {
            console.log('Usage: node src/holons/data/data-backup.ts restore <backup-id> [target-directory]');
            process.exit(1);
          }
          await backupManager.restoreBackup(backupId, targetDir);
          break;
          
        case 'delete':
          const deleteId = args[1];
          if (!deleteId) {
            console.log('Usage: node src/holons/data/data-backup.ts delete <backup-id>');
            process.exit(1);
          }
          await backupManager.deleteBackup(deleteId);
          break;
          
        case 'stats':
          const stats = await backupManager.getBackupStats();
          console.log('\n📊 BACKUP STATISTICS');
          console.log('='.repeat(40));
          console.log(`Total Backups: ${stats.totalBackups}`);
          console.log(`Total Size: ${backupManager['formatBytes'](stats.totalSize)}`);
          console.log(`Average Size: ${backupManager['formatBytes'](stats.averageSize)}`);
          console.log(`Oldest Backup: ${stats.oldestBackup}`);
          console.log(`Newest Backup: ${stats.newestBackup}`);
          break;
          
        default:
          console.log('Usage: node src/holons/data/data-backup.ts <command> [args...]');
          console.log('Commands:');
          console.log('  create [description]  - Create a new backup');
          console.log('  list                  - List all backups');
          console.log('  restore <id> [dir]    - Restore a backup');
          console.log('  delete <id>           - Delete a backup');
          console.log('  stats                 - Show backup statistics');
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Operation failed:', error);
      process.exit(1);
    }
  })();
} 