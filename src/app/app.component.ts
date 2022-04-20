import { Component, OnInit } from '@angular/core';
import { ChatService } from './components/chat/services/chat.service';
import { User } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cye-chat';

  users: {
    [key in number]: User;
  } = {};

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.users = this.chatService.users;
  }
}
