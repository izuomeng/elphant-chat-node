import Router from 'koa-router';
import { getUserById, insertUser, updateUser } from '../service/user';

const router = new Router();

router.get('/user/:id', async (ctx) => {
  const user = await getUserById(ctx.params.id);
  ctx.body = user;
});

router.post('/user', async (ctx) => {
  const reqBody = (ctx.request as any).body;
  await insertUser({
    id: reqBody.id,
    name: reqBody.name,
    avatar: reqBody.avatar,
    phone: reqBody.phone
  });
});

router.put('/user', async (ctx) => {
  const reqBody = (ctx.request as any).body;
  await updateUser(reqBody);
});

export default router;
