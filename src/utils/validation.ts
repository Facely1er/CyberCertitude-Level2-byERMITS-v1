import { z } from 'zod';
import DOMPurify from 'dompurify';

// Common validation schemas
const emailSchema = z.string().email('Invalid email address').toLowerCase();

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

// Validation helper functions
export function validateName(name: string): { isValid: boolean; error?: string } {
  try {
    nameSchema.parse(name);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid name' };
  }
}
const organizationSchema = z.string()
  .min(2, 'Organization name must be at least 2 characters')
  .max(100, 'Organization name must be less than 100 characters');

const phoneSchema = z.string()
  .regex(/^\+?1?\d{10,14}$/, 'Invalid phone number format');

// Form schemas
export const magicLinkSignUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  organization: organizationSchema,
  industry: z.string().min(1, 'Industry is required'),
  role: z.string().min(1, 'Role is required')
});

export const magicLinkSignInSchema = z.object({
  email: emailSchema
});

export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  organization: organizationSchema.optional()
});

// Sanitization utilities
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
}

export function sanitizeMarkdown(markdown: string): string {
  return DOMPurify.sanitize(markdown, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false
  });
}

// Validation helpers
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid email' };
  }
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid password' };
  }
}

// Form validation hook
export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  return {
    validate: (data: unknown): { isValid: boolean; errors?: Record<string, string> } => {
      try {
        schema.parse(data);
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach(err => {
            if (err.path.length > 0) {
              errors[err.path.join('.')] = err.message;
            }
          });
          return { isValid: false, errors };
        }
        return { isValid: false, errors: { general: 'Validation failed' } };
      }
    },
    
    validateField: (field: string, value: unknown): { isValid: boolean; error?: string } => {
      try {
        const fieldSchema = schema instanceof z.ZodObject ? schema.shape[field] : null;
        if (fieldSchema) {
          fieldSchema.parse(value);
        }
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { isValid: false, error: error.errors[0].message };
        }
        return { isValid: false, error: 'Invalid value' };
      }
    }
  };
}

// XSS prevention utilities
export function escapeHTML(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
}

export function unescapeHTML(str: string): string {
  const unescapeMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#39|#x2F);/g, (entity) => unescapeMap[entity] || entity);
}

// SQL injection prevention (for dynamic queries if needed)
export function escapeSQLString(str: string): string {
  return str.replace(/'/g, "''");
}

// File upload validation
const fileUploadSchema = z.object({
  name: z.string().max(255, 'File name too long'),
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string()
});

const allowedFileTypes = {
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  all: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

export function validateFileUpload(file: File, allowedTypes: string[] = allowedFileTypes.all): { isValid: boolean; error?: string } {
  try {
    fileUploadSchema.parse({
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }
    
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid file' };
  }
}