import { Component, Input, OnInit } from '@angular/core';
import { ChatRoom, User } from 'src/app/interfaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  @Input() chatRoom: ChatRoom = {} as ChatRoom;
  @Input() user: User = {} as User;
  @Input() active: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  getNumberUnreadMsgs(): number | null {
    const messageId = this.chatRoom.last_message.message_id!;
    const lastReadMessageId =
      this.chatRoom.members[this.user.id].last_read_message_id!;

    if (messageId !== null) {
      if (lastReadMessageId === null) {
        return messageId + 1;
      } else {
        return messageId + 1 - (lastReadMessageId + 1);
      }
    } else {
      return null;
    }
  }
}
