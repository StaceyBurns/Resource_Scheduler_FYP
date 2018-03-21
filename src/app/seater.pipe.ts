import { Pipe, PipeTransform } from '@angular/core';
import { DatabaseService } from './shared/database/database.service'
import {Resource} from './shared/interfaces/interfaces';

@Pipe({
  name: 'seater'
})
export class SeaterPipe implements PipeTransform {
  constructor(private db:DatabaseService){}

  transform(resources: Resource[]) {
    return resources.filter(resource => resource.title=="8seater");
  }

}

