import { ChatUser } from './user';

export interface ChatMessage {
  id: string;
  // 1:纯文本 2:图片
  type: number;
  // 不支持富文本，emoji也属于纯文本
  text: string;
  // 一条消息只能有一张图片
  image: string;
  // 发送人
  sender: ChatUser;
  // 接收人
  receiverId: string;
  // 发送时间
  time: number;
  // 是否已读 y: 已读 n: 未读
  haveRead: string;
}
