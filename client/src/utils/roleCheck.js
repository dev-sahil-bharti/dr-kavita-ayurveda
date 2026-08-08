/**
 * Utility to check if a user has the required roles.
 * @param {string} userRole - The current role of the user ('admin' | 'patient' | null)
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['admin'])
 * @returns {boolean} - True if allowed, false otherwise
 */
export const hasRequiredRole = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};
