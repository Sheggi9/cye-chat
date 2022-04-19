import { Component, Input, OnInit } from '@angular/core';
import { UserStatus } from '../chat.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  @Input() member: UserStatus = {} as UserStatus;

  constructor() { }

  ngOnInit(): void {}

}
