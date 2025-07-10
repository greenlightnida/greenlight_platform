/**
 * Validation Utilities for Shared Utils Holon
 * 
 * PURPOSE: Consolidate validation patterns across the platform
 * - Data validation schemas
 * - Input sanitization
 * - Type checking utilities
 * - Custom validators
 */

import { LoggingUtils } from './logging-utils';

export interface ValidationRule {
  type: 'required' | 'type' | 'length' | 'range' | 'pattern' | 'custom';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  rule: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  value?: any;
  suggestion?: string;
}

export class ValidationUtils {
  private static instance: ValidationUtils;
  private logger: LoggingUtils;

  private constructor() {
    this.logger = LoggingUtils.getInstance();
  }

  static getInstance(): ValidationUtils {
    if (!ValidationUtils.instance) {
      ValidationUtils.instance = new ValidationUtils();
    }
    return ValidationUtils.instance;
  }

  /**
   * Validate data against schema
   */
  validate(data: any, schema: ValidationSchema): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = this.getNestedValue(data, field);
      
      for (const rule of rules) {
        const result = this.validateRule(field, value, rule);
        
        if (result.error) {
          errors.push(result.error);
        }
        
        if (result.warning) {
          warnings.push(result.warning);
        }
      }
    }

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };

    if (!result.isValid) {
      this.logger.warn('Validation failed', 'ValidationUtils', { 
        field: 'validation', 
        errors: result.errors 
      });
    }

    return result;
  }

  /**
   * Validate single rule
   */
  private validateRule(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    switch (rule.type) {
      case 'required':
        return this.validateRequired(field, value, rule);
      case 'type':
        return this.validateType(field, value, rule);
      case 'length':
        return this.validateLength(field, value, rule);
      case 'range':
        return this.validateRange(field, value, rule);
      case 'pattern':
        return this.validatePattern(field, value, rule);
      case 'custom':
        return this.validateCustom(field, value, rule);
      default:
        return {};
    }
  }

  /**
   * Required field validation
   */
  private validateRequired(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (value === undefined || value === null || value === '') {
      return {
        error: {
          field,
          message: rule.message || `${field} is required`,
          value,
          rule: 'required'
        }
      };
    }
    return {};
  }

  /**
   * Type validation
   */
  private validateType(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (value === undefined || value === null) return {};

    const expectedType = rule.value;
    let isValid = false;

    switch (expectedType) {
      case 'string':
        isValid = typeof value === 'string';
        break;
      case 'number':
        isValid = typeof value === 'number' && !isNaN(value);
        break;
      case 'boolean':
        isValid = typeof value === 'boolean';
        break;
      case 'object':
        isValid = typeof value === 'object' && value !== null && !Array.isArray(value);
        break;
      case 'array':
        isValid = Array.isArray(value);
        break;
      case 'email':
        isValid = typeof value === 'string' && this.isValidEmail(value);
        break;
      case 'url':
        isValid = typeof value === 'string' && this.isValidUrl(value);
        break;
      case 'date':
        isValid = value instanceof Date || !isNaN(Date.parse(value));
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be of type ${expectedType}`,
          value,
          rule: 'type'
        }
      };
    }

    return {};
  }

  /**
   * Length validation
   */
  private validateLength(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (value === undefined || value === null) return {};

    const { min, max } = rule.value || {};
    const length = this.getValueLength(value);

    if (min !== undefined && length < min) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be at least ${min} characters long`,
          value,
          rule: 'length'
        }
      };
    }

    if (max !== undefined && length > max) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be no more than ${max} characters long`,
          value,
          rule: 'length'
        }
      };
    }

    return {};
  }

  /**
   * Range validation
   */
  private validateRange(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (value === undefined || value === null) return {};

    const { min, max } = rule.value || {};
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be a valid number`,
          value,
          rule: 'range'
        }
      };
    }

    if (min !== undefined && numValue < min) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be at least ${min}`,
          value,
          rule: 'range'
        }
      };
    }

    if (max !== undefined && numValue > max) {
      return {
        error: {
          field,
          message: rule.message || `${field} must be no more than ${max}`,
          value,
          rule: 'range'
        }
      };
    }

    return {};
  }

  /**
   * Pattern validation
   */
  private validatePattern(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (value === undefined || value === null) return {};

    const pattern = rule.value;
    if (typeof value !== 'string' || !pattern.test(value)) {
      return {
        error: {
          field,
          message: rule.message || `${field} does not match required pattern`,
          value,
          rule: 'pattern'
        }
      };
    }

    return {};
  }

  /**
   * Custom validation
   */
  private validateCustom(field: string, value: any, rule: ValidationRule): {
    error?: ValidationError;
    warning?: ValidationWarning;
  } {
    if (!rule.validator) return {};

    try {
      const isValid = rule.validator(value);
      
      if (!isValid) {
        return {
          error: {
            field,
            message: rule.message || `${field} failed custom validation`,
            value,
            rule: 'custom'
          }
        };
      }
    } catch (error) {
      return {
        error: {
          field,
          message: `Validation error for ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          value,
          rule: 'custom'
        }
      };
    }

    return {};
  }

  /**
   * Get nested object value
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Get value length
   */
  private getValueLength(value: any): number {
    if (typeof value === 'string') {
      return value.length;
    }
    if (Array.isArray(value)) {
      return value.length;
    }
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length;
    }
    return 0;
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * URL validation
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize input data
   */
  sanitize(data: any, options: {
    trimStrings?: boolean;
    removeNulls?: boolean;
    escapeHtml?: boolean;
    maxDepth?: number;
  } = {}): any {
    const {
      trimStrings = true,
      removeNulls = false,
      escapeHtml = false,
      maxDepth = 10
    } = options;

    return this.sanitizeValue(data, { trimStrings, removeNulls, escapeHtml, maxDepth }, 0);
  }

  /**
   * Sanitize single value
   */
  private sanitizeValue(value: any, options: any, depth: number): any {
    if (depth > options.maxDepth) {
      return value;
    }

    if (value === null || value === undefined) {
      return options.removeNulls ? undefined : value;
    }

    if (typeof value === 'string') {
      let sanitized = value;
      
      if (options.trimStrings) {
        sanitized = sanitized.trim();
      }
      
      if (options.escapeHtml) {
        sanitized = this.escapeHtml(sanitized);
      }
      
      return sanitized;
    }

    if (Array.isArray(value)) {
      return value
        .map(item => this.sanitizeValue(item, options, depth + 1))
        .filter(item => !options.removeNulls || item !== undefined);
    }

    if (typeof value === 'object') {
      const sanitized: any = {};
      
      for (const [key, val] of Object.entries(value)) {
        const sanitizedVal = this.sanitizeValue(val, options, depth + 1);
        if (!options.removeNulls || sanitizedVal !== undefined) {
          sanitized[key] = sanitizedVal;
        }
      }
      
      return sanitized;
    }

    return value;
  }

  /**
   * Escape HTML characters
   */
  private escapeHtml(text: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return text.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
  }

  /**
   * Common validation schemas
   */
  static getCommonSchemas() {
    return {
      email: [
        { type: 'required' as const, message: 'Email is required' },
        { type: 'type' as const, value: 'email', message: 'Invalid email format' }
      ],
      
      password: [
        { type: 'required' as const, message: 'Password is required' },
        { type: 'length' as const, value: { min: 8 }, message: 'Password must be at least 8 characters' },
        { 
          type: 'custom' as const, 
          message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
          validator: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
        }
      ],
      
      url: [
        { type: 'required' as const, message: 'URL is required' },
        { type: 'type' as const, value: 'url', message: 'Invalid URL format' }
      ],
      
      phone: [
        { type: 'pattern' as const, value: /^[\+]?[1-9][\d]{0,15}$/, message: 'Invalid phone number format' }
      ],
      
      uuid: [
        { type: 'pattern' as const, value: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, message: 'Invalid UUID format' }
      ]
    };
  }
} 