import { PASSWORD_MIN_LENGTH, NICKNAME_MIN_LENGTH, NICKNAME_MAX_LENGTH } from './constants';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }
  return { valid: true };
};

/**
 * Validate nickname
 */
export const isValidNickname = (nickname: string): { valid: boolean; message?: string } => {
  if (nickname.length < NICKNAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `Nickname must be at least ${NICKNAME_MIN_LENGTH} characters`,
    };
  }
  if (nickname.length > NICKNAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `Nickname must be less than ${NICKNAME_MAX_LENGTH} characters`,
    };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return {
      valid: false,
      message: 'Nickname can only contain letters, numbers, and underscores',
    };
  }
  return { valid: true };
};

/**
 * Validate phone number (Indonesian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate postal code (Indonesian format)
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalRegex = /^[0-9]{5}$/;
  return postalRegex.test(postalCode);
};

/**
 * Validate credit card number (basic Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};