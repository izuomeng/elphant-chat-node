import path from 'path';
import WebSocket from 'ws';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { getUserById, insertUser, updateUser } from './service/user';
import { UniResponse } from './model/uni-response';
import { checkAndSendCachedMessage, insertMessage } from './service/message';

const server = new WebSocket.Server({ port: 3001 });
const connectionPool: Record<string, WebSocket> = {};

server.on('connection', function connection(ws, req) {
  const userId = new URLSearchParams(req.url?.slice(2)).get('uid');
  if (!userId) {
    console.warn('Connection must have uid !');
    return;
  }

  console.log('%s is connected', userId);
  connectionPool[userId] = ws;

  checkAndSendCachedMessage({ ws, uid: userId });

  ws.on('message', (message) => {
    try {
      const messageStr = message.toString();
      const realMessage = JSON.parse(messageStr);
      if (realMessage.type === 100) {
        const chatMessage = realMessage.content;
        const receiverId = chatMessage.receiverId;
        const targetUserWs = connectionPool[receiverId];
        const originUserWs = connectionPool[userId];

        [originUserWs, targetUserWs].forEach(async (ws, index) => {
          // 如果用户在线
          if (ws && ws.readyState === WebSocket.OPEN) {
            const m = {
              type: 101,
              content: chatMessage
            };
            ws.send(JSON.stringify(m));
            console.log('send message to: ', [userId, receiverId][index]);
          } else {
            console.log('save message to user:', receiverId);
            // 不在线则把消息先存起来
            await insertMessage(chatMessage);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  ws.on('close', () => {
    console.log('close connection: ', userId);
    delete connectionPool[userId];
  });
});

const app = new Koa();
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

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
    ctx.body = new UniResponse({ success: true, content: ctx.body });
  } catch (error) {
    ctx.status = 200;
    ctx.body = new UniResponse({ success: false, content: null, message: error.message });
    ctx.app.emit('error', error);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// 全局错误事件监听
app.on('error', (error) => {
  console.error(error);
});

app.listen(3000, () => {
  console.log('http server is starting at port 3000');
});
