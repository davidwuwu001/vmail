/**
 * 邮箱管理相关 API
 */

import { getToken } from './authApi';

const API_BASE = '/api';

export interface Mailbox {
  id: string;
  address: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface CreateMailboxRequest {
  localPart: string;
  expiryHours: number | null;
}

export interface Email {
  id: string;
  subject: string;
  from: { address: string; name: string };
  date: string;
  text: string;
  html: string;
}

/**
 * 获取请求头（包含认证 token）
 */
function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * 获取用户的所有邮箱
 */
export async function getMailboxes(): Promise<Mailbox[]> {
  const response = await fetch(`${API_BASE}/mailboxes`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '获取邮箱列表失败');
  }

  const data = await response.json();
  return data.mailboxes;
}

/**
 * 创建新邮箱
 */
export async function createMailbox(data: CreateMailboxRequest): Promise<Mailbox> {
  const response = await fetch(`${API_BASE}/mailboxes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '创建邮箱失败');
  }

  const result = await response.json();
  return result.mailbox;
}

/**
 * 删除邮箱
 */
export async function deleteMailbox(mailboxId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/mailboxes/${mailboxId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '删除邮箱失败');
  }
}

/**
 * 获取邮箱的邮件列表
 */
export async function getMailboxEmails(mailboxId: string): Promise<Email[]> {
  const response = await fetch(`${API_BASE}/mailboxes/${mailboxId}/emails`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '获取邮件列表失败');
  }

  const data = await response.json();
  return data.emails;
}

/**
 * 生成随机邮箱名
 */
export function generateRandomMailboxName(): string {
  const adjectives = ['happy', 'sunny', 'clever', 'brave', 'swift', 'bright', 'calm', 'cool'];
  const nouns = ['panda', 'tiger', 'eagle', 'dolphin', 'fox', 'wolf', 'bear', 'lion'];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adj}${noun}${randomNum}`;
}
