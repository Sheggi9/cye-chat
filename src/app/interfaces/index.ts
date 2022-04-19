import { Subject } from "rxjs";


export interface Message {
    user_id: number | null;
    message_id: number | null;
    date: string;
    text: string;
    wasChanged: boolean
}

export interface User {
    user_id: number,
    user_name: string,
    is_online: boolean
  }
  
  export interface UserStatus extends User {
    is_write_message: boolean,
    last_read_message_id: number | null,
  }

export interface ChatRoom {
    chat_room_id: number,
    name: string,
    last_message: Message,
    messages: Map<number, Message>,
    members: {
        [key in number]: UserStatus
    }
}



export type ChatRoomsStore = {
    [key in number] : ChatRoom
}
export type UsersRoomsStore = {
    [key in number]: number[]
}
export type UsersStore = {
    [key in number]: User
}
export type UserChatRoomSelector = {
    messages: Subject<Message>,
    chatRoom: Subject<ChatRoom>
}

export type UserChatRoomSelectorsStore = {
    [key in number]: {
        messages: Subject<Message>,
        chatRoom: Subject<ChatRoom>
    }   
}

export type UserId = number;
export type IsSselected = boolean;

