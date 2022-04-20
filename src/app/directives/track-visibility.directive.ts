import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Message, User } from '../interfaces';

@Directive({
  selector: '[appTrackVisibility]'
})
export class TrackVisibilityDirective implements OnInit, OnDestroy{
  @Input('appTrackVisibility') set message(msg: Message) {
    this.msg = msg;
  }
  @Input() checkLastReadMs: HTMLDivElement = {} as HTMLDivElement;
  @Input() user: User = {} as User;
  @Output() lastRead = new EventEmitter<number>();

  observer!: IntersectionObserver;
  msg: Message = {} as Message;
  lastReadedMessageId: number | null = null;



  constructor(private el: ElementRef<HTMLElement>, private ngZone: NgZone) {}


  ngOnInit(): void {
    if(this.msg.user_id !== this.user.id) {
      this.ngZone.runOutsideAngular(() => {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((_: any) => {
            if(this.lastReadedMessageId! < this.msg.message_id!) {
              if(this.elementsOverlap(this.checkLastReadMs, this.el, this.msg)) {
                this.ngZone.run(() => {
                    this.lastRead.emit(this.msg.message_id!);
                })
              }
            }
          });
        });
        this.observer.observe(this.el.nativeElement);
      });
    }
  }

  ngOnDestroy(): void {
    // this.observer.disconnect();
  }

  elementsOverlap(el1: HTMLDivElement, el2: ElementRef<HTMLElement>, msg: Message) {
    const line = el1.getBoundingClientRect();
    const message = el2.nativeElement.getBoundingClientRect();

    return message.top > 0 && line.bottom >= message.top && (msg.user_id !== this.user.id) ;
  }
}
