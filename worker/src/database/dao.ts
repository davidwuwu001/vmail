import { count, desc, eq, and, inArray, lt } from "drizzle-orm";
// fix: 将数据库类型从 LibSQLDatabase 更改为 DrizzleD1Database，以匹配 Cloudflare D1
import { DrizzleD1Database } from "drizzle-orm/d1";
// refactor: 更新 schema 的导入路径
import { emails, InsertEmail, users, InsertUser, mailboxes, InsertMailbox } from "./schema";

export async function insertEmail(db: DrizzleD1Database, email: InsertEmail) {
  try {
    await db.insert(emails).values(email).execute();
  } catch (e) {
    console.error(e);
  }
}

export async function getEmails(db: DrizzleD1Database) {
  try {
    return await db.select().from(emails).execute();
  } catch (e) {
    return [];
  }
}

// 函数重命名：将 getEmail 重命名为 findEmailById 以匹配 worker 中的调用
export async function findEmailById(db: DrizzleD1Database, id: string) {
  try {
    const result = await db
      .select()
      .from(emails)
      .where(and(eq(emails.id, id)))
      .execute();
    if (result.length != 1) {
      return null;
    }
    return result[0];
  } catch (e) {
    return null;
  }
}

// 该函数已不再需要，因为密码现在是邮箱地址的加密版本
// export async function getEmailByPassword(db: DrizzleD1Database, id: string) {
// ...
// }

export async function getEmailsByMessageTo(
  db: DrizzleD1Database,
  messageTo: string
) {
  try {
    return await db
      .select()
      .from(emails)
      .where(eq(emails.messageTo, messageTo))
      .orderBy(desc(emails.createdAt))
      .execute();
  } catch (e) {
    return [];
  }
}

export async function getEmailsCount(db: DrizzleD1Database) {
  try {
    const res = await db.select({ count: count() }).from(emails);
    return res[0]?.count;
  } catch (e) {
    return 0;
  }
}

// 新增函数：添加 worker 中缺失的 deleteEmails 函数
export async function deleteEmails(db: DrizzleD1Database, ids: string[]) {
    if (!ids || ids.length === 0) {
        return { count: 0 };
    }
    try {
        const result = await db.delete(emails).where(inArray(emails.id, ids));
        return { count: result.rowsAffected };
    } catch (e) {
        console.error(e);
        return { count: 0 };
    }
}

/**
 * 新增函数：根据提供的过期时间删除此时间之前的所有邮件。
 * @param db Drizzle 数据库实例。
 * @param expirationTime 一个 Date 对象，表示过期时间点。
 * @returns 返回一个包含已删除邮件数量的对象，或在出错时返回 { count: 0 }。
 */
export async function deleteExpiredEmails(db: DrizzleD1Database, expirationTime: Date) {
    try {
        // 使用Drizzle的lt（小于）操作符来比较createdAt字段和expirationTime
        const result = await db.delete(emails).where(lt(emails.createdAt, expirationTime)).execute();
        // 返回受影响的行数，即已删除的邮件数量
        return { count: result.rowsAffected };
    } catch (e) {
        // 如果在删除过程中发生错误，则在控制台打印错误信息
        console.error('清理过期邮件失败:', e);
        // 并返回一个表示删除数量为0的对象
        return { count: 0 };
    }
}


// ==================== 用户相关操作 ====================

/**
 * 创建新用户
 */
export async function createUser(db: DrizzleD1Database, user: InsertUser) {
  try {
    await db.insert(users).values(user).execute();
    return user;
  } catch (e) {
    console.error('创建用户失败:', e);
    return null;
  }
}

/**
 * 根据用户名查找用户
 */
export async function findUserByUsername(db: DrizzleD1Database, username: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();
    return result[0] || null;
  } catch (e) {
    console.error('查找用户失败:', e);
    return null;
  }
}

/**
 * 根据用户ID查找用户
 */
export async function findUserById(db: DrizzleD1Database, userId: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .execute();
    return result[0] || null;
  } catch (e) {
    console.error('查找用户失败:', e);
    return null;
  }
}

// ==================== 邮箱相关操作 ====================

/**
 * 创建新邮箱
 */
export async function createMailbox(db: DrizzleD1Database, mailbox: InsertMailbox) {
  try {
    await db.insert(mailboxes).values(mailbox).execute();
    return mailbox;
  } catch (e) {
    console.error('创建邮箱失败:', e);
    return null;
  }
}

/**
 * 根据邮箱地址查找邮箱
 */
export async function findMailboxByAddress(db: DrizzleD1Database, address: string) {
  try {
    const result = await db
      .select()
      .from(mailboxes)
      .where(eq(mailboxes.address, address))
      .execute();
    return result[0] || null;
  } catch (e) {
    console.error('查找邮箱失败:', e);
    return null;
  }
}

/**
 * 获取用户的所有邮箱
 */
export async function getMailboxesByUserId(db: DrizzleD1Database, userId: string) {
  try {
    return await db
      .select()
      .from(mailboxes)
      .where(eq(mailboxes.userId, userId))
      .orderBy(desc(mailboxes.createdAt))
      .execute();
  } catch (e) {
    console.error('获取用户邮箱列表失败:', e);
    return [];
  }
}

/**
 * 删除邮箱
 */
export async function deleteMailbox(db: DrizzleD1Database, mailboxId: string) {
  try {
    const result = await db
      .delete(mailboxes)
      .where(eq(mailboxes.id, mailboxId))
      .execute();
    return { count: result.rowsAffected };
  } catch (e) {
    console.error('删除邮箱失败:', e);
    return { count: 0 };
  }
}

/**
 * 根据邮箱ID获取邮件列表
 */
export async function getEmailsByMailboxId(db: DrizzleD1Database, mailboxId: string) {
  try {
    return await db
      .select()
      .from(emails)
      .where(eq(emails.mailboxId, mailboxId))
      .orderBy(desc(emails.createdAt))
      .execute();
  } catch (e) {
    console.error('获取邮箱邮件失败:', e);
    return [];
  }
}

/**
 * 删除过期的邮箱及其邮件
 */
export async function deleteExpiredMailboxes(db: DrizzleD1Database, currentTime: Date) {
  try {
    // 查找所有过期的邮箱
    const expiredMailboxes = await db
      .select()
      .from(mailboxes)
      .where(
        and(
          lt(mailboxes.expiresAt, currentTime),
          // 只删除有过期时间的邮箱（永久邮箱的 expiresAt 为 null）
          eq(mailboxes.expiresAt, mailboxes.expiresAt)
        )
      )
      .execute();

    if (expiredMailboxes.length === 0) {
      return { count: 0 };
    }

    const mailboxIds = expiredMailboxes.map(m => m.id);

    // 删除这些邮箱的所有邮件
    await db
      .delete(emails)
      .where(inArray(emails.mailboxId, mailboxIds))
      .execute();

    // 删除邮箱
    const result = await db
      .delete(mailboxes)
      .where(inArray(mailboxes.id, mailboxIds))
      .execute();

    return { count: result.rowsAffected };
  } catch (e) {
    console.error('删除过期邮箱失败:', e);
    return { count: 0 };
  }
}
