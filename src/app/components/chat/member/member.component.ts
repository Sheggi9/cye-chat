import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  @Input() member: Member = {} as Member;
  @Input() active: boolean = false;
  @Input() hideUnreadMsCounter: boolean = false;
  @Input() unreadMsCounter: number | null = null;

  constructor() {}

  ngOnInit(): void {}

  countUnreadedMessages(
    unreadedCounter: number,
    readedCounter: number
  ): number {
    if (unreadedCounter !== 0) {
      return unreadedCounter - readedCounter;
    }
    return unreadedCounter - readedCounter + 1;
  }
}
