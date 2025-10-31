const AUTH_KEY = "cyberwise_session";
const USER_KEY = "cyberwise_user";

export interface AuthUser {
  id: string;
  admissionNumber: string;
  fullName: string;
  email: string;
  role: "student" | "admin";
  mustChangePassword?: boolean;
}

let cachedUser: AuthUser | null = null;

export function getAuthToken(): string | null {
  return sessionStorage.getItem(AUTH_KEY);
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(AUTH_KEY, token);
}

export function removeAuthToken(): void {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(USER_KEY);
  cachedUser = null;
}

export function getCurrentUser(): AuthUser | null {
  if (cachedUser) return cachedUser;
  
  const userStr = sessionStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    cachedUser = JSON.parse(userStr);
    return cachedUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser): void {
  cachedUser = user;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(AUTH_KEY, "authenticated");
}

export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getCurrentUser();
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}
