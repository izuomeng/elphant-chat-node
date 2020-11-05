import Router from 'koa-router';
import { getUserFriend, insertUserFriend } from '../service/user-friend';

const router = new Router();

router.get('/friend/apply', async (ctx) => {
  ctx.body = await getUserFriend({ fromUid: ctx.query.uid });
});

router.get('/friend/receive', async (ctx) => {
  ctx.body = await getUserFriend({ toUid: ctx.query.uid });
});

router.get('/friend/now', async (ctx) => {
  const receivedFriends = await getUserFriend({ toUid: ctx.query.uid, agreed: 'y' });
  const appliedFriends = await getUserFriend({ fromUid: ctx.query.uid, agreed: 'y' });
  ctx.body = [...receivedFriends, ...appliedFriends].sort((x, y) => y.time - x.time);
});

router.post('/friend/apply', async (ctx) => {
  const reqBody = (ctx.request as any).body;
  await insertUserFriend({ fromUid: reqBody.fromUid, toUid: reqBody.toUid });
});

export default router;
