import { Role } from "@/generated/prisma";

export type UserSession = {
  id: string;
  email: string;
  name?: string | null;
  roles: Role[];
};

/**
 * Check if user has a specific role
 */
export function hasRole(user: UserSession | null, role: Role): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: UserSession | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: UserSession | null, roles: Role[]): boolean {
  if (!user) return false;
  return roles.every((role) => user.roles.includes(role));
}

/**
 * Check if user is a parent
 */
export function isParent(user: UserSession | null): boolean {
  return hasRole(user, Role.PARENT);
}

/**
 * Check if user is a teacher
 */
export function isTeacher(user: UserSession | null): boolean {
  return hasRole(user, Role.TEACHER);
}

/**
 * Check if user is an admin (includes PRINCIPAL)
 */
export function isAdmin(user: UserSession | null): boolean {
  return hasAnyRole(user, [Role.ADMIN, Role.PRINCIPAL]);
}

/**
 * Check if user is an executive (includes PRINCIPAL)
 */
export function isExecutive(user: UserSession | null): boolean {
  return hasAnyRole(user, [Role.EXECUTIVE, Role.PRINCIPAL]);
}

/**
 * Check if user is a principal
 */
export function isPrincipal(user: UserSession | null): boolean {
  return hasRole(user, Role.PRINCIPAL);
}

/**
 * Check if user can access parent portal (must be parent with enrolled child)
 * Note: Enrolled child check should be done at the API level
 */
export function canAccessParentPortal(user: UserSession | null): boolean {
  return isParent(user);
}

/**
 * Check if user can access teacher portal
 */
export function canAccessTeacherPortal(user: UserSession | null): boolean {
  return isTeacher(user);
}

/**
 * Check if user can access admin portal
 */
export function canAccessAdminPortal(user: UserSession | null): boolean {
  return isAdmin(user);
}

/**
 * Check if user can access executive portal
 */
export function canAccessExecutivePortal(user: UserSession | null): boolean {
  return isExecutive(user);
}
