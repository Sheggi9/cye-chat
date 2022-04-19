import { Pipe, PipeTransform } from '@angular/core';
import { Member, User } from '../interfaces';



 
@Pipe({
    name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  transform<T>(usersObj: {[key in number]: T }, excludeId: number): {[key in number]: T } {
    return Object.fromEntries(Object.entries(usersObj).filter(([key]) => !key.includes(String(excludeId))));
  }
}