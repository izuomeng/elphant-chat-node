import Router from 'koa-router';
import { getUserById, getUserByPhone, insertUser, updateUser } from '../service/user';

const router = new Router();

router.get('/user/phone/:number', async (ctx) => {
  if (ctx.params?.number) {
    ctx.body = await getUserByPhone(ctx.params.number);
  } else {
    ctx.body = null;
  }
});

router.get('/user/:id', async (ctx) => {
  if (ctx.params?.id) {
    ctx.body = await getUserById(ctx.params.id);
  } else {
    ctx.body = null;
  }
});

router.post('/user', async (ctx) => {
  const reqBody = ctx.request.body;
  await insertUser({
    id: reqBody.id,
    name: reqBody.name,
    avatar: reqBody.avatar,
    phone: reqBody.phone
  });
});

router.put('/user', async (ctx) => {
  const reqBody = ctx.request.body;
  await updateUser(reqBody);
});

export default router;
