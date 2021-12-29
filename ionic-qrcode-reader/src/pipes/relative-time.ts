import { Pipe, PipeTransform } from '@angular/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import * as moment from 'moment';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTime implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  }
}