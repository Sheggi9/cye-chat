import { KeyValue } from '@angular/common';
import { Component, Input, OnInit} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ChatService } from './services/chat.service';


export interface ChatRoom {
  chat_room_id: number,
  name: string,
  last_message: Message,
  messages: Map<number, Message>,
  members: {
    [key in number]: UserStatus
  }
}

export interface UserStatus extends User {
  is_write_message: boolean,
  last_read_message_id: number | null,
}

export interface User {
  user_id: number,
  user_name: string,
  is_online: boolean
}

export interface Message {
  user_id: number | null;
  message_id: number | null;
  date: string;
  text: string;
  wasChanged: boolean
}





@Component({
  selector: 'app-chat[user]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() user: User = {} as User;

  messageText: string = '';
  lastSendendMessageId: number | null = null;
  showNewRoomMenu: boolean = false;
  isWriteMessageNow: boolean = false;
  isWriteMessage: Subject<any> = new Subject();
  currentMessage: Message = {} as Message;
  currentChatRoom: number | undefined;

  isSelectUser: boolean = false;

  chatRooms: {
    [key in number] : ChatRoom
  } = {};

  users: {
    [key in number]: User
  } = {}


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    console.log(this.user);
    
    this.resetMessageValue()

    // TODO: return Observable with chats
    // this.chatRooms = this.chatService.getChatRooms(this.user.user_id);

    const chat: {
      messages: Subject<Message>,
      chatRoom: Subject<ChatRoom>
    } = this.chatService.getChatRooms$(this.user.user_id);


    chat.chatRoom.subscribe((chatRoom: ChatRoom) => {
      console.log(chatRoom)
      this.chatRooms[chatRoom.chat_room_id] = chatRoom
    });

    chat.messages.subscribe((msg: Message) => {
      console.log(msg)
      console.log(msg)
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
    // Stop writing
    if(this.isWriteMessageNow) {
      this.isWriteMessageNow = false;
      this.chatService.writingMessageInProgress(this.currentChatRoom!, this.user.user_id, false);
    }
    //
    this.currentChatRoom = chat_room_id;
    this.resetMessageValue()
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

   toggleRoomMenu(user: User) {
     console.log("toggleRoomMenu")
     console.log(user)
     console.log("toggleRoomMenu")
    //  if() {

    //  }
     this.showNewRoomMenu = !this.showNewRoomMenu;
   }

   checkChatRooms() {
     return Object.keys(this.chatRooms).length === 0
   }
}
