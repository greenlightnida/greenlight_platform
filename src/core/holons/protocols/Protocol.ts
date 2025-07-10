/**
 * Protocol Interface
 * 
 * PURPOSE: Defines the standard interface for all protocols in the system.
 * Ensures consistent protocol structure and execution patterns.
 * 
 * USAGE: Implement this interface for all protocol classes
 */

export interface Protocol {
  /**
   * Execute the protocol with optional parameters
   */
  execute(options?: any): Promise<any>;
  
  /**
   * Get protocol metadata
   */
  getMetadata?(): {
    name: string;
    version: string;
    description: string;
    dependencies: string[];
  };
  
  /**
   * Validate protocol prerequisites
   */
  validate?(): Promise<boolean>;
} 