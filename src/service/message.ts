import WebSocket from 'ws';
import { elephantDb } from '../common/db';
import { ChatMessage } from '../model/message';

export async function getMessages(params?: { receiverId?: string }): Promise<ChatMessage[]> {
  const db = await elephantDb.getDb();
  const sql = params?.receiverId
    ? 'select * from message where receiverId = ?'
    : 'select * from message';
  const messages = await db.all(sql, params?.receiverId);
  return messages.map((item) => ({ ...item, sender: JSON.parse(item.sender) }));
}

export async function removeMessage(id: string) {
  const db = await elephantDb.getDb();
  await db.run('DELETE FROM message WHERE id = ?', id);
}

export async function insertMessage(message: ChatMessage) {
  const db = await elephantDb.getDb();
  await db.run('insert into message values (?, ?, ?, ?, ?, ?, ?, ?)', [
    message.id,
    message.text,
    message.type,
    message.image,
    JSON.stringify(message.sender),
    message.receiverId,
    message.time,
    message.haveRead
  ]);
}

export async function checkAndSendCachedMessage(params: { ws: WebSocket; uid: string }) {
  const { ws, uid } = params;

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }

  const messages = await getMessages();

  messages.forEach(async (message) => {
    if (message.receiverId === uid) {
      const sendedMessage = {
        type: 101,
        content: message
      };
      ws.send(JSON.stringify(sendedMessage));
      console.log('send cached message to user: ', uid);
      await removeMessage(message.id);
    }
  });
}
