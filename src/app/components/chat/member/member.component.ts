import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  @Input() member: Member = {} as Member;

  constructor() { }

  ngOnInit(): void {}

}
