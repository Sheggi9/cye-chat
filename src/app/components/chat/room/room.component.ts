import { Component, Input, OnInit } from '@angular/core';
import { ChatRoom, User } from 'src/app/interfaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @Input() chatRoom: ChatRoom = {} as ChatRoom;
  @Input() user: User = {} as User;

  constructor() { }

  ngOnInit(): void {
  }

}
