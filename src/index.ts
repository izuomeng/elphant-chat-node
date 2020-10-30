import WebSocket from 'ws';

const server = new WebSocket.Server({ port: 3001 });
const connectionPool: Record<string, WebSocket> = {};
const chatMessagePool = [];

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
}

server.on('connection', function connection(ws, req) {
  const userId = new URLSearchParams(req.url?.slice(2)).get('uid');

  if (!userId) {
    console.warn('Connection must have uid !');
    return;
  }

  console.log('%s is connected', userId);
  connectionPool[userId] = ws;

  ws.on('message', (message) => {
    console.log('received: %s from %s', message, userId);
    try {
      const messageStr = message.toString();
      const realMessage = JSON.parse(messageStr);
      if (realMessage.type === 100) {
        const chatMessage = realMessage.content;
        const receiverId = chatMessage.receiverId;
        const targetUserWs = connectionPool[receiverId];
        const originUserWs = connectionPool[userId];

        [originUserWs, targetUserWs].forEach((ws, index) => {
          // 如果用户在线
          if (ws && ws.readyState === WebSocket.OPEN) {
            const m = {
              type: 101,
              content: chatMessage
            };
            ws.send(JSON.stringify(m));
            console.log('send message to: ', [userId, receiverId][index]);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
    // 广播消息给所有客户端
    // server.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(clientName + " -> " + message);
    //   }
    // });
  });

  ws.on('close', () => {
    delete connectionPool[userId];
  });
});

import Koa from 'koa';
const app = new Koa();

import Router from 'koa-router';

// 装载所有子路由
let router = new Router();

router.get('/message/send', async (ctx) => {
  ctx.body = 'hhhhh';
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log('[demo] route-use-middleware is starting at port 3000');
});
