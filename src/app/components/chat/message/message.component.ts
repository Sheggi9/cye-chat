import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, User } from 'src/app/interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() showName: boolean = false;
  @Input() authorName: string = '';
  @Input() user: User = {} as User;
  @Input() currentChatRoom: number | undefined;
  @Input() message: Message = {} as Message;
  @Input() currentMessage: Message = {} as Message;
  @Input() messageText: string = '';
  @Input() isLast: boolean = false;
  @Input() wrapperElement: HTMLDivElement = {} as HTMLDivElement;
  @Input() lastSendendMessageId: number | undefined;

  @Output() setLastSendendMessageId: EventEmitter<number> = new EventEmitter();
  @Output() changeMessage: EventEmitter<Message> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
    if (
      this.isLast && this.message.user_id === this.user.user_id 
    ) {
      this.setLastSendendMessage()
    }
  }
  

  editMessage() {
    this.changeMessage.emit(this.message)
  }

  setLastSendendMessage(){
    this.setLastSendendMessageId.emit(this.message.message_id!);
  }
}
