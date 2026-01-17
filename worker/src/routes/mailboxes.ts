import { Hono } from 'hono';
import { nanoid } from 'nanoid/non-secure';
import { getD1DB } from '../database/db';
import {
  createMailbox,
  findMailboxByAddress,
  getMailboxesByUserId,
  deleteMailbox,
  getEmailsByMailboxId,
} from '../database/dao';
import { verifyToken, extractToken } from '../auth';
import type { Env } from '../index';

const mailboxes = new Hono<{ Bindings: Env }>();

/**
 * 认证中间件
 */
const authMiddleware = async (c, next) => {
  const token = extractToken(c.req.raw);
  if (!token) {
    return c.json({ message: '未授权：缺少 token' }, 401);
  }

  const payload = verifyToken(token, c.env.COOKIES_SECRET);
  if (!payload) {
    return c.json({ message: '未授权：token 无效或已过期' }, 401);
  }

  // 将用户 ID 存入上下文
  c.set('userId', payload.userId);
  await next();
};

// 所有邮箱路由都需要认证
mailboxes.use('/*', authMiddleware);

/**
 * 获取用户的所有邮箱
 */
mailboxes.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const db = getD1DB(c.env.DB);

    const userMailboxes = await getMailboxesByUserId(db, userId);

    return c.json({
      mailboxes: userMailboxes.map(m => ({
        id: m.id,
        address: m.address,
        expiresAt: m.expiresAt,
        createdAt: m.createdAt,
      })),
    });
  } catch (e) {
    console.error('获取邮箱列表错误:', e);
    return c.json({ message: '获取邮箱列表失败' }, 500);
  }
});

/**
 * 创建新邮箱
 */
mailboxes.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const { localPart, expiryHours } = await c.req.json();

    if (!localPart) {
      return c.json({ message: '邮箱名不能为空' }, 400);
    }

    // 验证邮箱名格式（只允许字母、数字、点、下划线、连字符）
    if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) {
      return c.json({ message: '邮箱名只能包含字母、数字、点、下划线和连字符' }, 400);
    }

    const db = getD1DB(c.env.DB);
    const emailDomain = c.env.EMAIL_DOMAIN.split(',')[0].trim();
    const address = `${localPart}@${emailDomain}`;

    // 检查邮箱是否已存在
    const existing = await findMailboxByAddress(db, address);
    if (existing) {
      return c.json({ message: '该邮箱地址已被使用' }, 409);
    }

    // 计算过期时间
    let expiresAt: Date | null = null;
    if (expiryHours && expiryHours > 0) {
      expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    }

    // 创建邮箱
    const now = new Date();
    const mailbox = await createMailbox(db, {
      id: nanoid(),
      userId,
      address,
      expiresAt,
      createdAt: now,
      updatedAt: now,
    });

    if (!mailbox) {
      return c.json({ message: '创建邮箱失败' }, 500);
    }

    return c.json({
      message: '邮箱创建成功',
      mailbox: {
        id: mailbox.id,
        address: mailbox.address,
        expiresAt: mailbox.expiresAt,
        createdAt: mailbox.createdAt,
      },
    });
  } catch (e) {
    console.error('创建邮箱错误:', e);
    return c.json({ message: '创建邮箱失败' }, 500);
  }
});

/**
 * 删除邮箱
 */
mailboxes.delete('/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const mailboxId = c.req.param('id');
    const db = getD1DB(c.env.DB);

    // 验证邮箱是否属于当前用户
    const userMailboxes = await getMailboxesByUserId(db, userId);
    const mailbox = userMailboxes.find(m => m.id === mailboxId);

    if (!mailbox) {
      return c.json({ message: '邮箱不存在或无权删除' }, 404);
    }

    // 删除邮箱（会级联删除相关邮件）
    const result = await deleteMailbox(db, mailboxId);

    if (result.count === 0) {
      return c.json({ message: '删除邮箱失败' }, 500);
    }

    return c.json({ message: '邮箱已删除' });
  } catch (e) {
    console.error('删除邮箱错误:', e);
    return c.json({ message: '删除邮箱失败' }, 500);
  }
});

/**
 * 获取邮箱的邮件列表
 */
mailboxes.get('/:id/emails', async (c) => {
  try {
    const userId = c.get('userId');
    const mailboxId = c.req.param('id');
    const db = getD1DB(c.env.DB);

    // 验证邮箱是否属于当前用户
    const userMailboxes = await getMailboxesByUserId(db, userId);
    const mailbox = userMailboxes.find(m => m.id === mailboxId);

    if (!mailbox) {
      return c.json({ message: '邮箱不存在或无权访问' }, 404);
    }

    // 获取邮件列表
    const emails = await getEmailsByMailboxId(db, mailboxId);

    return c.json({ emails });
  } catch (e) {
    console.error('获取邮件列表错误:', e);
    return c.json({ message: '获取邮件列表失败' }, 500);
  }
});

export default mailboxes;
