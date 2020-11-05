import { BoolString } from '../common/types';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  phone: string;
}

export interface UserFriend {
  id: string;
  fromUser: ChatUser;
  toUser: ChatUser;
  agreed: BoolString;
  time: number;
}
