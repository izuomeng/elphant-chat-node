import { elephantDb } from '../common/db';
import { generateID } from '../common/utils';
import { ChatUser } from '../model/user';

export async function getUserById(uid: string): Promise<ChatUser> {
  const db = await elephantDb.getDb();
  const user = await db.get('select * from user where id = ?', uid);
  if (!user) {
    throw new Error('user not exists');
  }
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone
  };
}

export async function getUserByPhone(number: string): Promise<ChatUser> {
  const db = await elephantDb.getDb();
  const user = await db.get('select * from user where phone = ?', number);
  if (!user) {
    throw new Error('user not exists');
  }
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    phone: user.phone
  };
}

export async function insertUser(user: ChatUser) {
  const db = await elephantDb.getDb();
  await db.run(
    'insert into user values (?, ?, ?, ?)',
    user.id || generateID(),
    user.name,
    user.avatar,
    user.phone
  );
}

export async function updateUser(user: Pick<ChatUser, 'id'> & Partial<ChatUser>) {
  const db = await elephantDb.getDb();
  const { id, ...userInfo } = user;
  const sqlStrAry = Object.keys(userInfo).map((key) => `${key} = ?`);
  const sqlParams = Object.values(userInfo);
  await db.run(`UPDATE user SET ${sqlStrAry} WHERE id = ?`, [...sqlParams, user.id]);
}
