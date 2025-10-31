import { Student } from "@shared/schema";

const AUTH_KEY = "cyberwise_auth";
const USER_KEY = "cyberwise_user";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser(): Student | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: Student): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.isAdmin === true;
}
