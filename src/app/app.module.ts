import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserFilterPipe } from './pipes/UserFilterPipe';
import { WhoImComponent } from './components/chat/who-im/who-im.component';
import { MemberComponent } from './components/chat/member/member.component';
import { UserComponent } from './components/chat/user/user.component';
import { MessageComponent } from './components/chat/message/message.component';
import { RoomComponent } from './components/chat/room/room.component';
import { TrackVisibilityDirective } from './directives/track-visibility.directive';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    UserFilterPipe,
    WhoImComponent,
    MemberComponent,
    UserComponent,
    MessageComponent,
    RoomComponent,
    TrackVisibilityDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
