import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IsSselected, User, UserId } from 'src/app/interfaces';


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

  @Output() selectedToCreateGroup: EventEmitter<[UserId, IsSselected]> = new EventEmitter();

  isChecked: boolean = false;

  constructor() { }

  ngOnInit(): void {}

  startMessagingWith() {
    this.selectedUser.emit(this.user);
  }

  selectUser(){
    this.selectedToCreateGroup.emit([this.user.user_id, this.isChecked]);
  }

}
