import {RoomData} from './rooms';
import {User} from './users';
import _ from 'lodash';

export class RoomMock {
  //static names = ['Lobby', 'Chaos'];

  constructor() {

  }

  static all() {
    return _.map(this.names, (obj, key) => new RoomData({
      pk: key,
      topic: obj,
      slug: 'rooms:' + obj.toLocaleLowerCase(),
      joined: false,
      selected: false,
      messages: [],
      users: []
    }));
  }

  static get(name) {
    return _.find(this.all(), (i) => i.name == name);
  }
}

export class UserMock {
  //static names = ['Hera', 'Chantal', 'Spooky'];

  constructor() {

  }

  static all() {
    return _.map(this.names, (obj, pk) => new User({
      pk: pk,
      username: obj,
      avatar: `http://lorempixel.com/100/100/people/${pk}/`
    }));
  }

  static get(name) {
    return _.find(this.all(), (i) => i.username == name);
  }
}

export default RoomMock;