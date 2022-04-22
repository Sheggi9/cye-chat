import { KeyValue } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import {
  ChatRoom,
  ChatRoomsStore,
  IsSselected,
  MembersStore,
  Message,
  MessagesStore,
  User,
  UserId,
  UsersStore,
} from 'src/app/interfaces';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-chat[user]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() user: User = {} as User;

  messageText: string = '';
  groupName: string = '';
  lastSendendMessageId: number | null = null;
  showNewRoomMenu: boolean = false;
  isWriteMessageNow: boolean = false;
  isWriteMessage: Subject<any> = new Subject();
  currentMessage: Message = {} as Message;
  currentChatRoomId: number | undefined;
  usersGroup: Set<number> = new Set();
  isSelectUser: boolean = false;
  chatRooms: ChatRoomsStore = {};
  users: UsersStore = {};
  chat: Subject<ChatRoom> = {} as Subject<ChatRoom>;

  lastReadedMessgesIdArr: number[] = [];
  lastReadMsId: number | null = null;
  msgsIsInvisible: boolean = true;
  showEmptyList: boolean = false;

  constructor(private chatService: ChatService, private rd: Renderer2) {}

  ngOnInit(): void {
    this.resetMessageValue();
    this.chat = this.chatService.getChatRooms$(this.user.id).chatRoom;
    this.chat.subscribe((chatRoom: ChatRoom) => {
      this.chatRooms[chatRoom.chat_room_id] = chatRoom;
    });
    this.chatService.connect(this.user.id);
    this.isWriteMessage.pipe(debounceTime(600)).subscribe((_) => {
      this.isWriteMessageNow = false;
      this.chatService.writingMessageInProgress(
        this.currentChatRoomId!,
        this.user.id,
        false
      );
    });
  }

  ngOnDestroy(): void {
    this.chat.unsubscribe();
  }

  get usersGroupSize(): boolean {
    return this.usersGroup.size > 0;
  }

  get getMessagesAsArray(): Message[] {
    return this.getArray(this.getMessages);
  }

  get getlastReadMsId(): number {
    return this.getMembers[this.user.id].last_read_message_id!;
  }

  get getMembers(): MembersStore {
    return this.getChatRoom.members;
  }

  get getMessages(): MessagesStore {
    return this.getChatRoom.messages;
  }
  get getChatRoom(): ChatRoom {
    return this.chatRooms[this.currentChatRoomId!];
  }

  setCurrentChatRoom(chat_room_id: number): void {
    
    if(this.currentChatRoomId !== chat_room_id) {
      
      this.msgsIsInvisible = true;
      this.showEmptyList = true;
      setTimeout(() => {
        this.showEmptyList = false;
      })
      
      this.immediatelyStopWriting();
      this.currentChatRoomId = chat_room_id;
      this.resetLastSenMsgsIdSetting();
      this.resetMessageValue();

      if(this.getChatRoom && (this.getlastReadMsId !== null)) {
        this.lastReadMsId = this.getlastReadMsId;
      }

      if(this.getMessages.size) {
        this.msgsIsInvisible = true; 
      }

      if(this.lastReadMsId !== null) {
        setTimeout(() => {
          const wrapperEl = this.rd.selectRootElement('#messages-wrapper'+ this.user.id, true);
          const lastReadedEl = wrapperEl.querySelector('#last-readed');
          lastReadedEl.scrollIntoView({block: "end", behavior: "auto"});
          this.msgsIsInvisible = false;
        })
      }
    }



  } 

  sendlastReadMsId(id: number) {
    this.lastReadedMessgesIdArr.push(id);
    this.lastReadedMessgesIdArr.sort(function (a, b) {
      return a - b;
    });
    const lastId =
      this.lastReadedMessgesIdArr[this.lastReadedMessgesIdArr.length - 1];


    if (this.lastReadMsId! < lastId || (this.lastReadMsId! === null && this.isId(lastId))) {
      this.chatService.markAsReaded(
        this.currentChatRoomId!,
        this.user.id,
        lastId
      );
      this.lastReadMsId = lastId;

      if(this.msgsIsInvisible) {
        this.msgsIsInvisible = false;
      }
    }
  }

  sendMessage() {
    const ms = this.messageText.trim();
    if (ms) {
      this.currentMessage.text = ms;
      this.chatService.sendMessage(
        this.currentMessage,
        this.currentChatRoomId!
      );
      this.resetMessageValue();

      if(this.getMessages.size) {
        this.msgsIsInvisible = false; 
      }
    }
  }

  resetLastSenMsgsIdSetting() {
    this.lastReadedMessgesIdArr = [];
    this.lastReadMsId = null;
  }

  immediatelyStopWriting() {
    if (this.isWriteMessageNow) {
      this.isWriteMessageNow = false;
      this.chatService.writingMessageInProgress(
        this.currentChatRoomId!,
        this.user.id,
        false
      );
    }
  }

  resetMessageValue() {
    this.messageText = '';
    this.currentMessage = {
      date: null,
      message_id: null,
      text: '',
      user_id: this.user.id,
      wasChanged: false,
    };
  }



  inputEvent() {
    if (!this.isWriteMessageNow) {
      this.isWriteMessageNow = true;
      this.chatService.writingMessageInProgress(
        this.currentChatRoomId!,
        this.user.id,
        true
      );
    }
    this.isWriteMessage.next(null);
  }

  editMessage(userId: number, messageId: number, text: string, date: number) {
    this.messageText = text;
    this.currentMessage.user_id = userId;
    this.currentMessage.message_id = messageId;
    this.currentMessage.date = date;
    this.currentMessage.text = text;
  }

  identify(
    index: number,
    kv: KeyValue<number, Message>
  ): KeyValue<number, Message> {
    return kv;
  }

  isId(id: number): boolean {
    return id !== null && id >= 0;
  }

  getAllUsers() {
    this.showNewRoomMenu = !this.showNewRoomMenu;
    this.users = this.chatService.getAllUsers();
  }

  createChatRoom(users: User) {
    // TODO: return list users id list
    this.chatService.createChatRoom(this.user.id, [users.id]);
    this.showNewRoomMenu = !this.showNewRoomMenu;
  }

  checkChatRooms() {
    return Object.keys(this.chatRooms).length === 0;
  }

  addUserToGroup(e: [UserId, IsSselected]) {
    const userId = e[0];
    const isSselected = e[1];

    isSselected ? this.usersGroup.add(userId) : this.usersGroup.delete(userId);

    if (!this.usersGroupSize) {
      this.groupName = '';
    }
  }

  createGroup() {
    const grName = this.groupName.trim();
    if (grName) {
      this.chatService.createChatRoom(
        this.user.id,
        Array.from(this.usersGroup.values()),
        this.groupName
      );
      this.backToMenu();
    }
  }

  setLastSendendMessageId(id: number, wrapperEl: HTMLDivElement) {
    this.lastSendendMessageId = id;
    setTimeout(() => {
      wrapperEl.scrollTop = wrapperEl.scrollHeight;
    });
  }

  changeMessage(msg: Message) {
    this.messageText = msg.text;
    this.currentMessage = msg;
  }

  changePlaceholder(el: HTMLInputElement): string {
    el.focus();
    return 'Enter group name...';
  }

  backToMenu() {
    this.showNewRoomMenu = !this.showNewRoomMenu;
    this.usersGroup = new Set();
    this.groupName = '';
    this.isSelectUser = false;
  }

  getArray<T extends Map<number, Message>>(map: T): Message[] {
    return Array.from(map.values());
  }

  getDate(msg: Message | undefined): number | null {
    return msg ? msg.date : null;
  }


}
