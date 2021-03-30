import Router from 'koa-router';
import { UserFriendSingle } from '../model/user';
import { getUserFriend, insertUserFriend } from '../service/user-friend';

const router = new Router();

router.get('/friend/apply', async (ctx) => {
  ctx.body = await getUserFriend({ fromUid: String(ctx.query.uid) });
});

router.get('/friend/receive', async (ctx) => {
  ctx.body = await getUserFriend({ toUid: String(ctx.query.uid) });
});

router.get('/friend/now', async (ctx) => {
  const receivedFriends = await getUserFriend({ toUid: String(ctx.query.uid), agreed: 'y' });
  const appliedFriends = await getUserFriend({ fromUid: String(ctx.query.uid), agreed: 'y' });
  const friendList1: UserFriendSingle[] = receivedFriends.map((item) => ({
    id: item.id,
    time: item.time,
    friend: item.fromUser,
    agreed: item.agreed,
    meApply: 'n'
  }));
  const friendList2: UserFriendSingle[] = appliedFriends.map((item) => ({
    id: item.id,
    time: item.time,
    friend: item.toUser,
    agreed: item.agreed,
    meApply: 'y'
  }));
  ctx.body = [...friendList1, ...friendList2].sort((x, y) => y.time - x.time);
});

router.post('/friend/apply', async (ctx) => {
  const reqBody = (ctx.request as any).body;
  await insertUserFriend({ fromUid: reqBody.fromUid, toUid: reqBody.toUid });
});

export default router;
