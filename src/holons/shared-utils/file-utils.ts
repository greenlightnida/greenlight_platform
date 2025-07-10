/**
 * File Utilities for Shared Utils Holon
 * 
 * PURPOSE: Consolidate common file operations used across the platform
 * - File system operations
 * - Directory management
 * - File scanning and filtering
 * - Backup and restoration
 * - Path manipulation
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  modified: Date;
  type: 'file' | 'directory';
  extension?: string;
}

export interface ScanOptions {
  patterns?: string[];
  excludePatterns?: string[];
  maxDepth?: number;
  includeHidden?: boolean;
  followSymlinks?: boolean;
}

export interface BackupOptions {
  source: string;
  destination: string;
  compress?: boolean;
  preserveStructure?: boolean;
  excludePatterns?: string[];
}

export class FileUtils {
  private static instance: FileUtils;

  static getInstance(): FileUtils {
    if (!FileUtils.instance) {
      FileUtils.instance = new FileUtils();
    }
    return FileUtils.instance;
  }

  /**
   * Scan directory for files matching patterns
   */
  async scanDirectory(dirPath: string, options: ScanOptions = {}): Promise<FileInfo[]> {
    const {
      patterns = ['*'],
      excludePatterns = [],
      maxDepth = Infinity,
      includeHidden = false,
      followSymlinks = false
    } = options;

    const files: FileInfo[] = [];
    
    const scanRecursive = (currentPath: string, depth: number = 0): void => {
      if (depth > maxDepth) return;

      try {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item);
          
          // Skip hidden files unless explicitly included
          if (!includeHidden && item.startsWith('.')) continue;
          
          // Check exclude patterns
          if (this.matchesPatterns(fullPath, excludePatterns)) continue;
          
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            files.push({
              path: fullPath,
              name: item,
              size: 0,
              modified: stat.mtime,
              type: 'directory'
            });
            
            scanRecursive(fullPath, depth + 1);
          } else if (stat.isFile()) {
            // Check include patterns
            if (this.matchesPatterns(fullPath, patterns)) {
              files.push({
                path: fullPath,
                name: item,
                size: stat.size,
                modified: stat.mtime,
                type: 'file',
                extension: path.extname(item)
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not scan directory ${currentPath}:`, error);
      }
    };
    
    scanRecursive(dirPath);
    return files;
  }

  /**
   * Check if path matches any of the given patterns
   */
  private matchesPatterns(filePath: string, patterns: string[]): boolean {
    return patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(path.basename(filePath));
      }
      return filePath.includes(pattern);
    });
  }

  /**
   * Create directory with parents if it doesn't exist
   */
  ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Copy file or directory
   */
  async copy(source: string, destination: string, options: { overwrite?: boolean } = {}): Promise<void> {
    const { overwrite = false } = options;
    
    if (!fs.existsSync(source)) {
      throw new Error(`Source does not exist: ${source}`);
    }
    
    const stat = fs.statSync(source);
    
    if (stat.isDirectory()) {
      await this.copyDirectory(source, destination, options);
    } else {
      await this.copyFile(source, destination, options);
    }
  }

  /**
   * Copy a single file
   */
  private async copyFile(source: string, destination: string, options: { overwrite?: boolean } = {}): Promise<void> {
    const { overwrite = false } = options;
    
    if (fs.existsSync(destination) && !overwrite) {
      throw new Error(`Destination already exists: ${destination}`);
    }
    
    this.ensureDirectory(path.dirname(destination));
    fs.copyFileSync(source, destination);
  }

  /**
   * Copy a directory recursively
   */
  private async copyDirectory(source: string, destination: string, options: { overwrite?: boolean } = {}): Promise<void> {
    const { overwrite = false } = options;
    
    if (fs.existsSync(destination) && !overwrite) {
      throw new Error(`Destination already exists: ${destination}`);
    }
    
    this.ensureDirectory(destination);
    
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath, options);
      } else {
        await this.copyFile(sourcePath, destPath, options);
      }
    }
  }

  /**
   * Create backup of files or directories
   */
  async createBackup(options: BackupOptions): Promise<string> {
    const {
      source,
      destination,
      compress = false,
      preserveStructure = true,
      excludePatterns = []
    } = options;
    
    if (!fs.existsSync(source)) {
      throw new Error(`Source does not exist: ${source}`);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${path.basename(source)}-backup-${timestamp}`;
    const backupPath = path.join(destination, backupName);
    
    this.ensureDirectory(destination);
    
    if (compress) {
      await this.createCompressedBackup(source, backupPath, excludePatterns);
    } else {
      await this.copy(source, backupPath, { overwrite: true });
    }
    
    return backupPath;
  }

  /**
   * Create compressed backup using tar
   */
  private async createCompressedBackup(source: string, destination: string, excludePatterns: string[]): Promise<void> {
    const excludeArgs = excludePatterns.map(pattern => `--exclude="${pattern}"`).join(' ');
    const command = `tar -czf "${destination}.tar.gz" ${excludeArgs} -C "${path.dirname(source)}" "${path.basename(source)}"`;
    
    try {
      execSync(command, { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`Failed to create compressed backup: ${error}`);
    }
  }

  /**
   * Read JSON file with error handling
   */
  readJsonFile<T = any>(filePath: string): T | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Warning: Could not read JSON file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Write JSON file with pretty formatting
   */
  writeJsonFile(filePath: string, data: any, options: { pretty?: boolean } = {}): void {
    const { pretty = true } = options;
    
    this.ensureDirectory(path.dirname(filePath));
    
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Calculate total size of directory
   */
  async calculateDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;
    
    const files = await this.scanDirectory(dirPath);
    
    for (const file of files) {
      if (file.type === 'file') {
        totalSize += file.size;
      }
    }
    
    return totalSize;
  }

  /**
   * Find files by content pattern
   */
  async findFilesByContent(dirPath: string, contentPattern: RegExp): Promise<FileInfo[]> {
    const files = await this.scanDirectory(dirPath, { patterns: ['*.js', '*.ts', '*.cjs', '*.json', '*.md'] });
    const matchingFiles: FileInfo[] = [];
    
    for (const file of files) {
      if (file.type === 'file') {
        try {
          const content = fs.readFileSync(file.path, 'utf8');
          if (contentPattern.test(content)) {
            matchingFiles.push(file);
          }
        } catch (error) {
          console.warn(`Warning: Could not read file ${file.path}:`, error);
        }
      }
    }
    
    return matchingFiles;
  }

  /**
   * Remove directory recursively
   */
  removeDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * Move file or directory
   */
  async move(source: string, destination: string): Promise<void> {
    if (!fs.existsSync(source)) {
      throw new Error(`Source does not exist: ${source}`);
    }
    
    this.ensureDirectory(path.dirname(destination));
    fs.renameSync(source, destination);
  }

  /**
   * Check if path is a directory
   */
  isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Check if path is a file
   */
  isFile(path: string): boolean {
    try {
      return fs.statSync(path).isFile();
    } catch {
      return false;
    }
  }

  /**
   * Get relative path from base directory
   */
  getRelativePath(basePath: string, targetPath: string): string {
    return path.relative(basePath, targetPath);
  }

  /**
   * Normalize path for cross-platform compatibility
   */
  normalizePath(filePath: string): string {
    return path.normalize(filePath);
  }

  /**
   * Resolve path relative to current working directory
   */
  resolvePath(relativePath: string): string {
    return path.resolve(relativePath);
  }
}

// Export singleton instance
export const fileUtils = FileUtils.getInstance(); 