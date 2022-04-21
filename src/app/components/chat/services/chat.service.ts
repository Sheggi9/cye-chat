import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ChatRoom,
  ChatRoomsStore,
  Message,
  UserChatRoomSelector,
  UserChatRoomSelectorsStore,
  UsersRoomsStore,
  UsersStore,
  MembersStore,
  Member,
} from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  lastChatRoomId: number = 0;
  messages: Map<number, Message> = new Map<number, Message>();
  chatRooms: ChatRoomsStore = {};
  usersRooms: UsersRoomsStore = {};
  usersMs: UserChatRoomSelectorsStore = {};
  users: UsersStore = {
    0: {
      id: 0,
      name: 'Sheggi',
      is_online: true,
    },
    1: {
      id: 1,
      name: 'Don',
      is_online: true,
    },
    2: {
      id: 2,
      name: 'Bony',
      is_online: false,
    },
    3: {
      id: 3,
      name: 'Andre',
      is_online: true,
    },
    4: {
      id: 4,
      name: 'Garry',
      is_online: false,
    },
    5: {
      id: 5,
      name: 'Jon',
      is_online: true,
    },
    6: {
      id: 6,
      name: 'Winny',
      is_online: false,
    },
    7: {
      id: 7,
      name: 'Zolon',
      is_online: false,
    },
    999: {
      id: 999,
      name: 'Bob',
      is_online: true,
    },
  };

  constructor() {}

  getChatRooms$(user_id: number): UserChatRoomSelector {
    if (!this.usersMs[user_id]) {
      this.usersMs[user_id] = {
        messages: new Subject<Message>(),
        chatRoom: new Subject<ChatRoom>(),
      };
    }
    return this.usersMs[user_id];
  }

  connect(user_id: number) {
    const usersRoomIds: number[] = this.usersRooms[user_id];

    if (usersRoomIds) {
      usersRoomIds.forEach((id) => {
        this.usersMs[user_id].chatRoom.next(this.chatRooms[id]);
      });
    }
  }

  sendMessage(msg: Message, chatRoomId: number) {
    const chatRoom = this.chatRooms[chatRoomId];
    const currentMember = chatRoom.members[msg.user_id!];

    if (msg.message_id !== null && msg.message_id >= 0) {
      msg.wasChanged = true;
      chatRoom.messages.set(msg.message_id!, msg);
      if (msg.message_id === chatRoom.last_message.message_id) {
        chatRoom.last_message = msg;
      }
    } else {
      msg.message_id =
        chatRoom.last_message.message_id === null
          ? 0
          : chatRoom.last_message.message_id! + 1;
      msg.date = Date.now();
      chatRoom.last_message = msg;
      chatRoom.messages.set(msg.message_id, msg);
      currentMember.last_read_message_id = msg.message_id;
      currentMember.unread_message_counter = 0;

      const flMembersObj = Object.fromEntries(
        Object.entries(chatRoom.members).filter(
          ([key]) => !key.includes(String(msg.user_id!))
        )
      );
      for (const memberId in flMembersObj) {
        const member = chatRoom.members[+memberId];
        let userLastMs = member.last_read_message_id!;

        if (userLastMs === null) {
          chatRoom.members[+memberId].unread_message_counter =
            chatRoom.messages.size;
        } else {
          chatRoom.members[+memberId].unread_message_counter =
            chatRoom.last_message.message_id! -
            chatRoom.members[+memberId].last_read_message_id!;
        }
      }
    }
  }

  writingMessageInProgress(
    chatRoomId: number,
    memberId: number,
    isWriteMessage: boolean
  ) {
    this.chatRooms[chatRoomId].members[memberId].is_write_message =
      isWriteMessage;
  }

  changeOnlineStatus(userId: number, status: boolean) {
    if (this.usersRooms[userId]) {
      this.usersRooms[userId].forEach((id) => {
        this.chatRooms[id].members[userId].is_online = status;
      });
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
        text: '',
        wasChanged: false,
      },
      messages: new Map<number, Message>(),
    };

    membersId.forEach((id) => {
      if (!this.usersMs[id]) {
        this.usersMs[id] = {
          messages: new Subject<Message>(),
          chatRoom: new Subject<ChatRoom>(),
        };
      }
      this.usersMs[id].chatRoom.next(this.chatRooms[this.lastChatRoomId]);
    });

    this.addСhatRoomForUsers(this.lastChatRoomId, membersId);
  }

  getMembers(usersIs: number[]): MembersStore {
    return usersIs.reduce(
      (obj, id) => ({
        ...obj,
        [id]: Object.assign(
          {
            ...this.users[id],
            is_write_message: false,
            last_read_message_id: null,
            unread_message_counter: 0,
          },
          id
        ),
      }),
      {}
    );
  }

  addСhatRoomForUsers(chatRoomId: number, usersId: number[]) {
    usersId.forEach((id) => {
      if (!this.usersRooms[id]) {
        this.usersRooms[id] = [];
      }
      this.usersRooms[id].push(chatRoomId);
    });
  }

  markAsReaded(
    chatRoomId: number,
    userId: number,
    lastReadedMessageId: number
  ) {
    const currentLastMessageId = this.getMember(chatRoomId, userId)
      .last_read_message_id!;

    if (
      currentLastMessageId < lastReadedMessageId ||
      (currentLastMessageId === null && lastReadedMessageId >= 0)
    ) {
      this.getMember(chatRoomId, userId).last_read_message_id =
        lastReadedMessageId;

      this.getMember(chatRoomId, userId).unread_message_counter =
        this.chatRooms[chatRoomId].last_message.message_id! -
        this.getMember(chatRoomId, userId).last_read_message_id!;
    }
  }

  getMember(chatRoomId: number, userId: number): Member {
    return this.chatRooms[chatRoomId].members[userId];
  }
}
