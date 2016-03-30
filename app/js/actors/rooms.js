import Socket from './socket';
import Logger from 'tide/logger';
//import Enum from 'es6-enum';
import RoomData from '../models/rooms';
import User from '../models/users';
import Message from '../models/messages';
import conf from 'configuration';

//const STATES = Enum('JOINED', 'NOT_JOINED');

export class Rooms{
  constructor(){
    this.rooms = [];
    this.connect_promise = null;
  }

  connect(token){
    this.connect_promise = this.connect_promise ||
      Socket.connect('chat', token)
        .then((ws) => {
            Logger.debug("Joined chat .... ");
            this.socket = ws;
            //this.system = this.socket.channel('system');
            //this.system.join((data) => {
              // todo: get roms via system channel
              // remove _find_all
            //});
        });

    return this.connect_promise;
  }

  first(){
    if(this.rooms.length > 0){
      return this.rooms[0];
    }else{
      return null;
    }
  }

  __find_all(){
    return fetch(conf.routes.rooms, {
      method: 'get',
      mode: 'cors'
    });
  }

  all(){
    return new Promise((resolve, reject) => {
      this.__find_all()
        .then((r) => r.json())
        .then((data) => {

          data['rooms'].map((room) => {
            let info = new RoomData(room);
            this.rooms.push(new Room(this.socket, info));
          });

          resolve(this.rooms);
        });
    });
  }

  leave_all(){
    // leave all rooms that you have joined
  }
}

class Room {
  /*
  *
  * High level Composition over a Phoenix Channel
  * and models/Rooms
  * */


  constructor(socket, model){
    this.chan = null;
    this.socket = socket;
    this.model = model;

    // Shortcuts
    this.messages = this.model.messages;
    this.users = this.model.users;

    this.handlers = {
      "simple_message": 'receive_simple',
      "system_message": 'receive_simple',
      "user:entered": 'receive_user_joined',
      "user:left": 'receive_user_left'
    };
  }

  static receive_unknown(event, payload, ref) {
    let is_phx_event = event.startsWith('phx_');
    if (!is_phx_event) {
      Logger.debug(`Unknown Message: ${event}  :: ${ref} :: `, payload);
    }
  }

  bind(){
    this.chan = this.socket.channel(`rooms:${this.model.topic}`);

    // Setup Default handler
    let room = this;

    // Bind Known Handlers
    let key, handler;
    for (key in room.handlers) {
      if (room.handlers.hasOwnProperty(key)) {
        handler = room[room.handlers[key]];
        handler.bind(room);
        room.handlers[key] = handler;
      }
    }

    room.chan.onMessage = (event, payload, ref) => {
      let handler = room.handlers[event];

      if (handler == undefined) {
        return Room.receive_unknown(event, payload, ref);
      }
      else {
        handler.call(room, payload);
      }
    };

    // Todo: hookup
    //room.channel.onError(() =>
    //  console.log("there was an error!"));
    // room.channel.onClose(() =>
    //  console.log("the channel has gone away gracefully"));

    // Todo: override chan.rejoin()
    // upon rejoining a room we should get the history and change UI to unpause room
    // modify it in phoenix.js  then pass it upstream?
  }

  leave(){
    this.chan.leave();
  }

  join(){

    return new Promise((resolve, reject) =>{
      if(this.chan && this.chan.joinedOnce){
        return resolve(this);
      }

      this.bind();

      this.chan.join()
          .receive("ok", (data) => {
            this.receive_history(data);
            resolve(this);
          })
          .receive("error", ({reason}) => {
            Logger.info(`Channel: Failed to join ${this.model.topic}` , reason);
            reject(reason);
          })
          .receive("timeout", () => {
            Logger.info("Channel: Networking issue. Still waiting...");
            reject("Channel: The connection timed out.");
          });
    });
  }

  receive_user_joined(payload){
    Logger.debug("entered room -->", payload);
    this.model.users.push(User.from(payload.user));
  }

  receive_user_left(payload){
    Logger.debug("left room --> ", payload);
    this.model.users = this.model.users.filter((u) => u.username != payload.user.username);
  }

  receive_history(data){
    let m = this.model;

    m.messages.clear();
    m.users.clear();

    data.messages.forEach((message) => {
      m.messages.push(Message.from(message));
    });

    data.users.forEach((user) => {
      m.users.push(User.from(user));
    });
  }

  receive_simple(message) {
    this.model.messages.push(Message.from(message));
  }

  send(text) {
    /*
     Example command
        /kick "Hera 94"
        For more look at BirdSong repo
    */
    if (text.startsWith('/')) {
      this.__push('command', {'text': text});
    }
    else{
      this.__push('simple_message', {'text': text});
    }
  }

  __push(event, payload) {
    // Wait ten seconds for each message

    // todo: rewrite PHoneix.socket so class Push, will return a promise
    // promise will either
    // reject with ('error'/'timeout' , reason)
    // resolve with (response)
    //

    //this.chan.push(event, payload, timeout)
    //  .then((response) => {
        /// do something
    //  }).catch((err, reason) => {
        /// do something
    //});

    let timeout = 10000;
    this.chan.push(event, payload, timeout)
      .receive("ok", (msg) => Logger.info("Push: created message. Received response of: ", msg))
      .receive("error", (reasons) => Logger.info("Push: create failed", reasons))
      .receive("timeout", () => Logger.info("Push: Networking issue..."));



    // Todo: optimistic addition
    //m.messages.push(Message.from(msg));
  }
}

export default Rooms;