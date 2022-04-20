import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatRoom, ChatRoomsStore, Message, UserChatRoomSelector, UserChatRoomSelectorsStore, UsersRoomsStore, UsersStore, Member } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  lastChatRoomId: number = 0;
  messages: Map<number, Message> = new Map<number, Message>();
  chatRooms: ChatRoomsStore = {}
  usersRooms: UsersRoomsStore = {}
  usersMs: UserChatRoomSelectorsStore  = {}
  users: UsersStore = {
    0: {
      id: 0,
      name: 'Sheggi',
      is_online: true
    },
    1: {
      id: 1,
      name: 'Don',
      is_online: true
    },
    2: {
      id: 2,
      name: 'Bony',
      is_online: false
    },
    3: {
      id: 3,
      name: 'Andre',
      is_online: true
    },
    4: {
      id: 4,
      name: 'Garry',
      is_online: false
    },
    5: {
      id: 5,
      name: 'Jon',
      is_online: true
    },
    6: {
      id: 6,
      name: 'Winny',
      is_online: false
    },
    7: {
      id: 7,
      name: 'Zolon',
      is_online: false
    },
    999: {
      id: 999,
      name: 'Bob',
      is_online: true
    }
  }
  
  constructor() {}

  getChatRooms$(user_id: number): UserChatRoomSelector {
    if(!this.usersMs[user_id]) {
      this.usersMs[user_id] = {
        messages: new Subject<Message>(),
        chatRoom: new Subject<ChatRoom>()
      }
    }
    return this.usersMs[user_id];
  }

  connect(user_id: number) {
    const usersRoomIds: number[] = this.usersRooms[user_id]

    if(usersRoomIds) {
      usersRoomIds.forEach(id => {
          this.usersMs[user_id].chatRoom.next(this.chatRooms[id]);
      })
    }
  }

  sendMessage(msg: Message, chatRoomId: number) {

    const chatRoom = this.chatRooms[chatRoomId];

    if(msg.message_id !== null && msg.message_id >= 0) {
      msg.wasChanged = true;
      chatRoom.messages.set(msg.message_id!, msg);
      if(msg.message_id === chatRoom.last_message.message_id) {
        chatRoom.last_message = msg;
      }
    } else {
      const lastMsgId = chatRoom.last_message.message_id;
      msg.message_id = lastMsgId === null ? 0 : chatRoom.last_message.message_id! + 1;
      msg.date = Date.now();
      chatRoom.last_message = msg;
      chatRoom.messages.set(msg.message_id, msg);
      chatRoom.members[msg.user_id!].last_read_message_id = msg.message_id;
    }
  }

  writingMessageInProgress(chatRoomId: number, memberId: number, isWriteMessage: boolean) {
    this.chatRooms[chatRoomId].members[memberId].is_write_message = isWriteMessage;
  }

  changeOnlineStatus(userId: number, status: boolean) {
    if(this.usersRooms[userId]) {
      this.usersRooms[userId].forEach(id => {
        this.chatRooms[id].members[userId].is_online = status;
      })
    }

  }

  getAllUsers(): UsersStore {
    return this.users;
  }

  createChatRoom(currentUserId: number, usersId: number[], groupName?: string) {
    this.lastChatRoomId = this.lastChatRoomId + 1;
    const membersId: number[] = [currentUserId, ...usersId];

    this.chatRooms[this.lastChatRoomId] = {
      chat_room_id: this.lastChatRoomId,
      name: groupName ? groupName : '',
      members: this.getMembers([currentUserId, ...usersId]),
      last_message: {
        message_id: null,
        user_id: null,
        date: null,
        text: "",
        wasChanged: false
      },
      messages: new Map<number, Message>(),
    }

    membersId.forEach(id => {
      if(!this.usersMs[id]) {
        this.usersMs[id] = {
          messages: new Subject<Message>(),
          chatRoom: new Subject<ChatRoom>()
        }
      }
      this.usersMs[id].chatRoom.next(this.chatRooms[this.lastChatRoomId]);
    })

    this.addСhatRoomForUsers(this.lastChatRoomId, membersId)
  } 

  getMembers(usersIs: number[]): {[key in number]: Member} {
    return usersIs.reduce((obj, id) => ({...obj, [id]: Object.assign({
      ...this.users[id],
      is_write_message: false,
      last_read_message_id: null,
    }, id)}), {});
  }

  addСhatRoomForUsers(chatRoomId: number, usersId: number[]) {
    usersId.forEach(id => {
      if(!this.usersRooms[id]) {
        this.usersRooms[id] = [];
      }
      this.usersRooms[id].push(chatRoomId);
    })
  }


  markAsReaded(chatRoomId: number, userId: number, lastReadedMessageId: number) {
    const currentLastMessageId = this.chatRooms[chatRoomId].members[userId].last_read_message_id!;
    if(currentLastMessageId < lastReadedMessageId) {
      this.chatRooms[chatRoomId].members[userId].last_read_message_id = lastReadedMessageId;
    }
  };
}
