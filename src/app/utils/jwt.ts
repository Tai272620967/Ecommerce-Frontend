/**
 * Utility functions for JWT token decoding
 */

interface JWTPayload {
  sub?: string;
  user?: {
    id: number;
    email: string;
    role?: string;
  };
  role?: string;
  permission?: string[] | any;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url encoded payload
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Get role from JWT token
 * @param token JWT token string
 * @returns Role string (ADMIN or USER)
 */
export function getRoleFromToken(token: string): string {
  const payload = decodeJWT(token);
  if (!payload) {
    return "USER";
  }
  
  // 1. Try to get role from direct role field (most reliable)
  if (payload.role) {
    return payload.role.toUpperCase(); // Normalize to uppercase
  }
  
  // 2. Try to get role from user object
  if (payload.user && typeof payload.user === 'object' && 'role' in payload.user) {
    const role = (payload.user as any).role;
    if (role) {
      return role.toUpperCase(); // Normalize to uppercase
    }
  }
  
  // 3. Check permissions array - ONLY check for ROLE_ADMIN (don't use fallback logic)
  if (payload.permission) {
    const permissions = Array.isArray(payload.permission) 
      ? payload.permission 
      : (typeof payload.permission === 'string' ? [payload.permission] : []);
    
    // ONLY check for ROLE_ADMIN - this is the definitive indicator of ADMIN role
    if (permissions.includes("ROLE_ADMIN")) {
      return "ADMIN";
    }
  }
  
  // Default to USER if no admin role found
  // Don't use fallback logic based on other permissions as it can be unreliable
  return "USER";
}

