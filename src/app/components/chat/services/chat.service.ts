import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ChatRoom, ChatRoomsStore, Message, UserChatRoomSelector, UserChatRoomSelectorsStore, UsersRoomsStore, UsersStore, UserStatus } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  lastChatRoomId: number = 0;

  chatRooms: ChatRoomsStore = {
    // 0: {
    //   chat_room_id: 0,
    //   name: "Bob",
    //   members: {
    //     0: {
    //       user_id: 0,
    //       user_name: 'Sheggi',
    //       is_write_message: false,
    //       last_read_message_id: null,
    //       is_online: true,
    //     }, 
    //     999: {
    //       user_id: 999,
    //       user_name: 'Bob',
    //       is_write_message: false,
    //       last_read_message_id: 0,
    //       is_online: true,
    //     }
    //   },
    //   last_message: {
    //     message_id: null,
    //     user_id: null,
    //     date: "",
    //     text: "",
    //     wasChanged: false
    //   },
    //   messages: new Map<number, Message>(),
    // }
  }

  usersRooms: UsersRoomsStore = {
    // 0: [0],
    // 999: [0]
  }

  users: UsersStore = {
    0: {
      user_id: 0,
      user_name: 'Sheggi',
      is_online: true
    },
    1: {
      user_id: 1,
      user_name: 'Don',
      is_online: true
    },
    2: {
      user_id: 2,
      user_name: 'Bony',
      is_online: false
    },
    3: {
      user_id: 3,
      user_name: 'Andre',
      is_online: true
    },
    4: {
      user_id: 4,
      user_name: 'Garry',
      is_online: false
    },
    5: {
      user_id: 5,
      user_name: 'Jon',
      is_online: true
    },
    6: {
      user_id: 6,
      user_name: 'Winny',
      is_online: false
    },
    7: {
      user_id: 7,
      user_name: 'Zolon',
      is_online: false
    },
    999: {
      user_id: 999,
      user_name: 'Bob',
      is_online: true
    }
  }

  usersMs: UserChatRoomSelectorsStore  = {
    // 0: {
    //   messages: new Subject<Message>(),
    //   chatRoom: new Subject<ChatRoom>()
    // },
    // 999: {
    //   messages: new Subject<Message>(),
    //   chatRoom: new Subject<ChatRoom>()
    // }
  }

  constructor() { }
  
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
    if(msg.message_id !== null && msg.message_id >= 0) {
      msg.wasChanged = true;
      this.chatRooms[chatRoomId].messages.set(msg.message_id!, msg);

      if(msg.message_id === this.chatRooms[chatRoomId].last_message.message_id) {
        this.chatRooms[chatRoomId].last_message = msg;
      }
    } else {
      const lastMsgId = this.chatRooms[chatRoomId].last_message.message_id;
      msg.message_id = lastMsgId === null ? 0 : this.chatRooms[chatRoomId].last_message.message_id! + 1;
      msg.date = this.formatDate();
      this.chatRooms[chatRoomId].last_message = msg;
      this.chatRooms[chatRoomId].messages.set(msg.message_id, msg);
    }
  }

  formatDate(): string {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.');
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

  createChatRoom(currentUserId: number, usersId: number[]) {
    this.lastChatRoomId = this.lastChatRoomId + 1;
    const membersId: number[] = [currentUserId, ...usersId];

    this.chatRooms[this.lastChatRoomId] = {
      chat_room_id: this.lastChatRoomId,
      name: "",
      members: this.getMembers([currentUserId, ...usersId]),
      last_message: {
        message_id: null,
        user_id: null,
        date: "",
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

  getMembers(usersIs: number[]): {[key in number]: UserStatus} {
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
}
