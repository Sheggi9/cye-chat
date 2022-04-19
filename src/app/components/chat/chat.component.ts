import { KeyValue } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ChatRoom, ChatRoomsStore, IsSselected, Message, User, UserChatRoomSelector, UserId, UsersStore } from 'src/app/interfaces';
import { ChatService } from './services/chat.service';



@Component({
  selector: 'app-chat[user]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() user: User = {} as User;

  messageText: string = '';
  groupName: string = '';
  lastSendendMessageId: number | null = null;
  showNewRoomMenu: boolean = false;
  isWriteMessageNow: boolean = false;
  isWriteMessage: Subject<any> = new Subject();
  currentMessage: Message = {} as Message;
  currentChatRoom: number | undefined;
  usersGroup: Set<number> = new Set();
  isSelectUser: boolean = false;
  chatRooms: ChatRoomsStore = {};
  users: UsersStore = {}


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.resetMessageValue()

    const chat: UserChatRoomSelector = this.chatService.getChatRooms$(this.user.user_id);

    chat.chatRoom.subscribe((chatRoom: ChatRoom) => {
      this.chatRooms[chatRoom.chat_room_id] = chatRoom
    });

    this.chatService.connect(this.user.user_id)


    this.isWriteMessage
      .pipe(
        debounceTime(600)
      )
      .subscribe(_ => {
        this.isWriteMessageNow = false;
        this.chatService.writingMessageInProgress(this.currentChatRoom!, this.user.user_id, false);
      })
  }

  setCurrentChatRoom(chat_room_id: number): void {
    this.immediatelyStopWriting();
    this.currentChatRoom = chat_room_id;
    this.resetMessageValue()
  }

  immediatelyStopWriting() {
    if(this.isWriteMessageNow) {
      this.isWriteMessageNow = false;
      this.chatService.writingMessageInProgress(this.currentChatRoom!, this.user.user_id, false);
    }
  }

  resetMessageValue() {
    this.messageText = '';
    this.currentMessage = {
      date: "",
      message_id: null,
      text: "",
      user_id: this.user.user_id,
      wasChanged: false
    };
  }

  sendMessage() {
    this.currentMessage.text = this.messageText;

    this.chatService.sendMessage(
      this.currentMessage, 
      this.currentChatRoom!
    );

    
    this.resetMessageValue();
  }

  inputEvent() {
    if(!this.isWriteMessageNow) {
      this.isWriteMessageNow = true;
      this.chatService.writingMessageInProgress(this.currentChatRoom!, this.user.user_id, true);
    }
    this.isWriteMessage.next(null);
  }

  scrollToBottom(el: HTMLDivElement, myMessage: boolean, msgId: number) {
    if(myMessage && (this.lastSendendMessageId != msgId)) {
      el.scrollTop = el.scrollHeight;
      this.lastSendendMessageId = msgId
    }
  }

   editMessage(userId: number, messageId: number, text: string, date: string ) {
      this.messageText = text;
      this.currentMessage.user_id = userId;
      this.currentMessage.message_id = messageId;
      this.currentMessage.date = date;
      this.currentMessage.text = text;
   }

   identify(index: number, kv: KeyValue<number,Message>): KeyValue<number,Message> {
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
      this.chatService.createChatRoom(this.user.user_id, [users.user_id]);
      this.showNewRoomMenu = !this.showNewRoomMenu;
   }

   checkChatRooms() {
     return Object.keys(this.chatRooms).length === 0
   }

   addUserToGroup(e: [UserId, IsSselected]) {
     const userId = e[0];
     const isSselected = e[1];

     isSselected ? this.usersGroup.add(userId) : this.usersGroup.delete(userId);

     if(!this.usersGroupSize) {
        this.groupName = ''
     }
   }

   createGroup() {
    this.chatService.createChatRoom(this.user.user_id, Array.from(this.usersGroup.values()), this.groupName);
    this.backToMenu()
   }

   setLastSendendMessageId(id: number, wrapperEl: HTMLDivElement) {
    this.lastSendendMessageId = id;
    setTimeout(() => {
      wrapperEl.scrollTop = wrapperEl.scrollHeight;
    })
    
   }

   changeMessage(msg: Message) {
      this.messageText = msg.text
      this.currentMessage = msg;
   }

   get usersGroupSize(): boolean {
     return this.usersGroup.size > 0
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
}
