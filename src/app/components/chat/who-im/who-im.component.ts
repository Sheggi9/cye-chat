import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from 'src/app/components/chat/services/chat.service';
import { User } from 'src/app/interfaces';


@Component({
  selector: 'app-who-im',
  templateUrl: './who-im.component.html',
  styleUrls: ['./who-im.component.scss']
})
export class WhoImComponent implements OnInit {
  @Input() user: User = {} as User;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }
  changeStatus() {
    this.user.is_online = !this.user.is_online
    this.chatService.changeOnlineStatus(this.user.id, this.user.is_online)
 }
}
