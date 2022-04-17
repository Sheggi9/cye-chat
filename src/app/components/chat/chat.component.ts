import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { ChatService } from '../services/chat.service';


export interface ChatRoom {
  chat_room_id: number,
  name: string,
  is_online: boolean,
  is_write_message: boolean,
  last_message: Message,
  messages: {
    [key in number]: Message
  },
  members: {
    [key in number]: UserStatus
  }
}

export interface UserStatus extends User {
  is_write_message: boolean,
  last_read_message_id: number | null
}

export interface User {
  user_id: number,
  user_name: string
}

export interface Message {
  user_id: number;
  message_id: number | null;
  date: string;
  text: string;
}





@Component({
  selector: 'app-chat[user]',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messageText: string = '';

  isWriteMessageNow: boolean = false;
  isWriteMessage: Subject<any> = new Subject();


  @Input() user: User = {} as User;

  currentChatRoom: number | undefined;

  chatRooms: {
    [key in number] : ChatRoom
  } = {};


  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatRooms = this.chatService.getChatRooms(this.user.user_id);
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
    this.currentChatRoom = chat_room_id;
  }

  sendMessage() {
    this.chatService.sendMessage(
      {
        date: "",
        message_id: null,
        text: this.messageText,
        user_id: this.user.user_id
      }, this.currentChatRoom!
    );

    this.messageText = '';
  }

  inputEvent() {
    if(!this.isWriteMessageNow) {
      this.isWriteMessageNow = true;
      this.chatService.writingMessageInProgress(this.currentChatRoom!, this.user.user_id, true);
    }
    this.isWriteMessage.next(null);
  }

  scrollToBottom(el: HTMLDivElement, myMessage: boolean) {
    if(myMessage) {
      el.scrollTop = el.scrollHeight;
    }
    
   }
}
