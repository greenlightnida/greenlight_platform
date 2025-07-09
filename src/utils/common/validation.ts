/**
 * Common validation utilities
 * Consolidated validation functions used across the application
 */

import { generateId } from './formatting';

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\-()\s]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};

export const isValidJerseyNumber = (value: number): boolean => {
  return Number.isInteger(value) && value >= 0 && value <= 99;
};

  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

export const validateRequired = (value: unknown): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validatePattern = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

// Composite validation functions
  const errors: string[] = [];

  // Name validation
  if (!validateRequired(data.name)) {
    errors.push('Name is required');
  } else if (!validateMinLength(data.name as string, 1)) {
    errors.push('Name must be at least 1 character');
  } else if (!validateMaxLength(data.name as string, 100)) {
    errors.push('Name must be less than 100 characters');
  }

  // Jersey number validation
  if (data.jerseyNumber !== undefined && data.jerseyNumber !== null) {
    const jerseyNum = Number(data.jerseyNumber);
    if (!isValidJerseyNumber(jerseyNum)) {
      errors.push('Jersey number must be between 0 and 99');
    }
  }

  // Email validation
  if (data.email && !isValidEmail(data.email as string)) {
    errors.push('Invalid email format');
  }

  // Phone validation
  if (data.phone && !isValidPhone(data.phone as string)) {
    errors.push('Invalid phone number format');
  }

  return errors;
};

// Validation rule interface
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'date' | 'phone' | 'url';
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

// Generic validation function
  // Required validation
  if (rule.required && !validateRequired(value)) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!validateRequired(value)) {
    return null;
  }

  const stringValue = String(value);

  // Type validation
  if (rule.type) {
    switch (rule.type) {
      case 'email':
        if (!isValidEmail(stringValue)) return 'Invalid email format';
        break;
      case 'phone':
        if (!isValidPhone(stringValue)) return 'Invalid phone format';
        break;
      case 'url':
        if (!isValidUrl(stringValue)) return 'Invalid URL format';
        break;
      case 'date':
        if (!isValidDate(stringValue)) return 'Invalid date format';
        break;
      case 'number':
        if (!isValidNumber(stringValue)) return 'Invalid number format';
        break;
    }
  }

  // Length validation
  if (rule.minLength && !validateMinLength(stringValue, rule.minLength)) {
    return `Minimum length is ${rule.minLength} characters`;
  }

  if (rule.maxLength && !validateMaxLength(stringValue, rule.maxLength)) {
    return `Maximum length is ${rule.maxLength} characters`;
  }

  // Range validation for numbers
  if (rule.minValue !== undefined || rule.maxValue !== undefined) {
    const numValue = Number(value);
    if (!isValidNumber(stringValue)) {
      return 'Invalid number format';
    }
    if (rule.minValue !== undefined && numValue < rule.minValue) {
      return `Minimum value is ${rule.minValue}`;
    }
    if (rule.maxValue !== undefined && numValue > rule.maxValue) {
      return `Maximum value is ${rule.maxValue}`;
    }
  }

  // Pattern validation
  if (rule.pattern && !validatePattern(stringValue, rule.pattern)) {
    return 'Invalid format';
  }

  // Custom validation
  if (rule.custom) {
    const result = rule.custom(value);
    if (typeof result === 'string') {
      return result;
    }
    if (!result) {
      return 'Invalid value';
    }
  }

  return null;
};

// Note: validateEmail, validatePhoneNumber, validateJerseyNumber, and validateRequired 
// are already defined above as isValidEmail, isValidPhone, isValidJerseyNumber, and validateRequired

/**
 * Validate field with custom validation function
 */
export function validateField<T>(
  value: T,
  validator: (value: T) => boolean,
  errorMessage?: string
): { isValid: boolean; error?: string } {
  const isValid = validator(value);
  return {
    isValid,
    error: isValid ? undefined : errorMessage || 'Invalid value'
  };
}

/**
 * Validate object against schema
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Record<keyof T, (value: unknown) => boolean>
): { isValid: boolean; errors: Record<keyof T, string> } {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
  let isValid = true;

  for (const [key, validator] of Object.entries(schema)) {
    const value = obj[key as keyof T];
    if (!validator(value)) {
      errors[key as keyof T] = `Invalid ${key}`;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Validate date format
 */
export function validateDate(date: string): boolean {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate CSV data structure
 */
export function validateCSVData(data: unknown[]): boolean {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;
  
  // Check if all items are objects
  return data.every(item => typeof item === 'object' && item !== null);
}

/**
 * Validate player data structure (simplified version)
 */
export function validatePlayerDataSimple(player: unknown): boolean {
  if (typeof player !== 'object' || player === null) return false;
  
  const playerObj = player as Record<string, unknown>;
  
  // Check required fields
  const requiredFields = ['name', 'jerseyNumber'];
  for (const field of requiredFields) {
    if (!(field in playerObj)) return false;
  }
  
  // Validate jersey number
  if (typeof playerObj.jerseyNumber !== 'number') return false;
  if (!isValidJerseyNumber(playerObj.jerseyNumber)) return false;
  
  // Validate name
  if (typeof playerObj.name !== 'string') return false;
  if (playerObj.name.trim().length === 0) return false;
  
  return true;
}

/**
 * Generate unique ID for validation purposes
 */
export function generateUniqueId(): string {
  return generateId();
}

/**
 * Check if value is empty
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Sanitize input string
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email: string): { isValid: boolean; sanitized?: string } {
  const sanitized = email.trim().toLowerCase();
  const isValid = isValidEmail(sanitized);
  
  return {
    isValid,
    sanitized: isValid ? sanitized : undefined
  };
}

/**
 * Validate and sanitize phone number
 */
export function validateAndSanitizePhone(phone: string): { isValid: boolean; sanitized?: string } {
  const sanitized = phone.replace(/[\s\-\(\)]/g, '');
  const isValid = isValidPhone(sanitized);
  
  return {
    isValid,
    sanitized: isValid ? sanitized : undefined
  };
} 