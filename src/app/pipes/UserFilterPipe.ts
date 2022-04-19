import { Pipe, PipeTransform } from '@angular/core';
import { User, UserStatus } from '../components/chat/chat.component';
 
@Pipe({
    name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  transform(usersObj: {[key in number]: UserStatus}, excludeId: number): {[key in number]: UserStatus} {
    return Object.fromEntries(Object.entries(usersObj).filter(([key]) => !key.includes(String(excludeId))));
  }
}