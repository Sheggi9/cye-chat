import { Subject } from 'rxjs';

export interface Message {
  user_id: number | null;
  message_id: number | null;
  date: number | null;
  text: string;
  wasChanged: boolean;
}

export interface User {
  // user_id: number,
  id: number;
  name: string;
  is_online: boolean;
  active_chat_rooms_with_users: Set<number>
}

export interface Member extends User {
  is_write_message: boolean;
  last_read_message_id: number | null;
  unread_message_counter: number
}

export interface ChatRoom {
  chat_room_id: number;
  name: string;
  last_message: Message;
  messages: MessagesStore;
  members: MembersStore;
}

export type ChatRoomsStore = {
  [key in number]: ChatRoom;
};
export type UsersRoomsStore = {
  [key in number]: number[];
};
export type UsersStore = {
  [key in number]: User;
};
export type MembersStore = {
  [key in number]: Member;
};
export type MessagesStore = Map<number, Message>;

export type UserChatRoomSelector = {
  messages: Subject<Message>;
  chatRoom: Subject<ChatRoom>;
};

export type UserChatRoomSelectorsStore = {
  [key in number]: {
    messages: Subject<Message>;
    chatRoom: Subject<ChatRoom>;
  };
};

export type UserId = number;
export type IsSselected = boolean;
