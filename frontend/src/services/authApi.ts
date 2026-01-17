/**
 * 认证相关 API
 */

const API_BASE = '/api';

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
  };
}

/**
 * 用户注册
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '注册失败');
  }

  return response.json();
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '登录失败');
  }

  return response.json();
}

/**
 * 保存 token 到 localStorage
 */
export function saveToken(token: string) {
  localStorage.setItem('auth_token', token);
}

/**
 * 获取 token
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * 删除 token
 */
export function removeToken() {
  localStorage.removeItem('auth_token');
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
