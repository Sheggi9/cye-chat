import { Injectable } from '@angular/core';
import { ChatRoom, Message } from '../chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatRooms: {
    [key in number] : ChatRoom
  } = {
    0: {
      chat_room_id: 0,
      is_online: true,
      is_write_message: true,
      name: "Bob",
      members: {
        0: {
            user_id: 0,
            user_name: 'Sheggi',
            is_write_message: false,
            last_read_message_id: null
        }, 
        999: {
          user_id: 999,
          user_name: 'Bob',
          is_write_message: true,
          last_read_message_id: 0
        }
      },
      last_message: {
        message_id: 1,
        user_id: 0,
        date: "17.04.2022",
        text: "Hi, I'm Sheggi!!! Nice to meet you!"
      },
      messages: {
        0: {
          message_id: 0,
          user_id: 999,
          date: "16.04.2022",
          text: "Hi, I'm Bob"
        },
        1: {
          message_id: 1,
          user_id: 0,
          date: "17.04.2022",
          text: "Hi, I'm Sheggi!!! Nice to meet you!"
        }
      }
    }
  }

  constructor() { }

  getChatRooms(user_id: number) {
    return this.chatRooms
  }

  sendMessage(msg: Message, chatRoomId: number) {
    // this.chatRooms[chatRoomId].messages.push(msg);

    msg.message_id = ++this.chatRooms[chatRoomId].last_message.message_id!;
    msg.date = this.formatDate();
    this.chatRooms[chatRoomId].last_message = msg;
    this.chatRooms[chatRoomId].messages[msg.message_id] = msg;
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

}
