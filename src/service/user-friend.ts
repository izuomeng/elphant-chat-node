import { elephantDb } from '../common/db';
import { BoolString } from '../common/types';
import { camelToUnderline, generateID } from '../common/utils';
import { UserFriend } from '../model/user';

export async function insertUserFriend(params: { fromUid: string; toUid: string }) {
  const db = await elephantDb.getDb();
  const id = generateID();
  await db.run('insert into user_friend values (?, ?, ?, ?, ?)', [
    id,
    params.fromUid,
    params.toUid,
    'n',
    Date.now()
  ]);
}

export async function getUserFriend(params: {
  fromUid?: string;
  toUid?: string;
  agreed?: BoolString;
}): Promise<UserFriend[]> {
  const db = await elephantDb.getDb();
  const sqlWhere = Object.keys(params)
    .map((key) => `user_friend.${camelToUnderline(key)} = ?`)
    .join(' and ');
  const sqlParams = Object.values(params);
  const rows = await db.all(
    `select
      user_friend.id as id,
      agreed,
      time,
      from_user.id as from_user_id,
      from_user.name as from_user_name,
      from_user.avatar as from_user_avatar,
      from_user.phone as from_user_phone,
      to_user.id as to_user_id,
      to_user.name as to_user_name,
      to_user.avatar as to_user_avatar,
      to_user.phone as to_user_phone
    from (user_friend left outer join user from_user on user_friend.from_uid = from_user.id)
      left outer join user to_user on user_friend.to_uid = to_user.id
    where ${sqlWhere}`,
    sqlParams
  );

  return rows.map((item) => ({
    id: item.id,
    fromUser: {
      id: item['from_user_id'],
      name: item['from_user_name'],
      avatar: item['from_user_avatar'],
      phone: item['from_user_phone']
    },
    toUser: {
      id: item['to_user_id'],
      name: item['to_user_name'],
      avatar: item['to_user_avatar'],
      phone: item['to_user_phone']
    },
    agreed: item.agreed,
    time: item.time
  }));
}
