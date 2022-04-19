import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { User } from '../chat.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user: User = {} as User;
  @Input() currentUserId: number | null = null;
  @Input() showCheckbox: boolean = false;
  
  @Output() selectedUser: EventEmitter<User> = new EventEmitter();

  @Output() selectedToCreateGroup: EventEmitter<User> = new EventEmitter();

  isChecked: boolean = false;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
  }

  startMessagingWith() {
    this.chatService.createChatRoom(this.currentUserId!, [this.user.user_id]);
    this.selectedUser.emit(this.user);
  }

  selectUser(){
    console.log(this.isChecked)
  }

}
