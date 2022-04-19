import { Component, OnInit } from '@angular/core';
import { User } from './components/chat/chat.component';
import { ChatService } from './components/chat/services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cye-chat';

  users: {
    [key in number]: User
  } = {};

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.users = this.chatService.users
  }
}
