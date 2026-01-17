import { Hono } from 'hono';
import { nanoid } from 'nanoid/non-secure';
import { getD1DB } from '../database/db';
import { createUser, findUserByUsername } from '../database/dao';
import { hashPassword, verifyPassword, generateToken } from '../auth';
import type { Env } from '../index';

const auth = new Hono<{ Bindings: Env }>();

/**
 * 用户注册
 */
auth.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: '用户名和密码不能为空' }, 400);
    }

    if (username.length < 3 || username.length > 20) {
      return c.json({ message: '用户名长度必须在 3-20 个字符之间' }, 400);
    }

    if (password.length < 6) {
      return c.json({ message: '密码长度至少为 6 个字符' }, 400);
    }

    const db = getD1DB(c.env.DB);

    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(db, username);
    if (existingUser) {
      return c.json({ message: '用户名已存在' }, 409);
    }

    // 创建新用户
    const now = new Date();
    const passwordHash = await hashPassword(password);
    const user = await createUser(db, {
      id: nanoid(),
      username,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    if (!user) {
      return c.json({ message: '注册失败' }, 500);
    }

    // 生成 token
    const token = generateToken(user.id, c.env.COOKIES_SECRET);

    return c.json({
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (e) {
    console.error('注册错误:', e);
    return c.json({ message: '注册失败' }, 500);
  }
});

/**
 * 用户登录
 */
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: '用户名和密码不能为空' }, 400);
    }

    const db = getD1DB(c.env.DB);

    // 查找用户
    const user = await findUserByUsername(db, username);
    if (!user) {
      return c.json({ message: '用户名或密码错误' }, 401);
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return c.json({ message: '用户名或密码错误' }, 401);
    }

    // 生成 token
    const token = generateToken(user.id, c.env.COOKIES_SECRET);

    return c.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (e) {
    console.error('登录错误:', e);
    return c.json({ message: '登录失败' }, 500);
  }
});

export default auth;
