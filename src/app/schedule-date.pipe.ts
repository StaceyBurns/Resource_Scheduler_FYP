import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleDate'
})
export class ScheduleDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}


