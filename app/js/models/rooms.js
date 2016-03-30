import _ from 'lodash';
import {observable, computed, extendObservable} from 'mobx';

export class RoomData {
  get number_of_users() {
    return this.users.length;
  }


  constructor(options) {
    let values = _.defaults(options, this.constructor.defaults);
    // todo: asStructure for everything except messages / users
    extendObservable(this, values);
    extendObservable(this, {number_of_users: this.number_of_users});
  }
}

RoomData.defaults = {
  pk: 0,
  topic: '',
  slug: '',
  unseen_messages: 0,
  joined: false,
  selected: false,
  messages: [],
  users: []
};




export default RoomData;