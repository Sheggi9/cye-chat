import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, User } from 'src/app/interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() isRight: boolean = false;
  @Input() possibleToEdit: boolean = false;
  @Input() prevMessageDate: number | null = null;
  @Input() nextMessageDate: number | null = null;
  @Input() showName: boolean = false;
  @Input() authorName: string = '';
  @Input() user: User = {} as User;
  @Input() message: Message = {} as Message;
  @Input() messageText: string = '';
  @Input() isLast: boolean = false;
  @Input() checkLastReadMs: HTMLDivElement = {} as HTMLDivElement;

  @Output() lastRead: EventEmitter<number> = new EventEmitter();
  @Output() setLastSendendMessageId: EventEmitter<number> = new EventEmitter();
  @Output() changeMessage: EventEmitter<Message> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.isLast && this.message.user_id === this.user.id) {
      this.setLastSendendMessage();
    }
  }

  editMessage() {
    this.changeMessage.emit(this.message);
  }

  setLastSendendMessage() {
    this.setLastSendendMessageId.emit(this.message.message_id!);
  }

  getDateFromMs(ms: number): number {
    const d = new Date(ms);
    return d.getDay() + d.getMonth() + d.getFullYear();
  }

  get daysEqual(): boolean {
    return (
      this.getDateFromMs(this.prevMessageDate!) !==
      this.getDateFromMs(this.message.date!)
    );
  }

  sendLastRead(id: number) {
    this.lastRead.emit(id);
  }
}
