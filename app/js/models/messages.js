import {Data} from './base';

export class Message extends Data {
  constructor(username, body, kind, pk = null, timestamp = null) {
    super();

    if (timestamp === null) {
      timestamp = Math.floor(Date.now() / 1000);
    }

    if (pk === null) {
      pk = timestamp;
    }

    this.pk = pk;
    this.timestamp = timestamp;
    this.username = username;
    this.body = body;
    this.kind = kind;
  }

  static simple(username, body, timestamp = null) {
    return new Message(username, body, 'simple', timestamp);
  }

  static system(body) {
    return new Message('[System]', body, 'system');
  }
}

Message.defaults = {
  pk: 0,
  username: '',
  body: '',
  timestamp: 0,
  kind: 'simple'
};

export default Message;