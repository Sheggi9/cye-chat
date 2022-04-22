import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter',
})
export class UserFilterPipe implements PipeTransform {
  transform<T>(
    usersObj: { [key in number]: T },
    excludeId: number,
    excludeIds?: Set<number>,
    isForGroup?: boolean,
  ): { [key in number]: T } {
    if(excludeIds) {
      excludeIds.add(excludeId)
    }
    console.log(isForGroup)
    return Object.fromEntries(
      Object.entries(usersObj).filter(
        ([key]) => excludeIds && !isForGroup ? !excludeIds.has(+key) : !String(excludeId).includes(key)
      )
    );
  }
}
