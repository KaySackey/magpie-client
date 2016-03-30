import './polyfill';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {extendObservable} from 'mobx';
import Component from 'tide/views';
import Logger from 'tide/logger';
import conf from 'configuration';

import RoomList from './components/room_list';
import ChatRoom from './pages/chat_room';
import ChatLobby from './pages/chat_lobby';

import Auth from './actors/auth';
import Rooms from './actors/rooms';
import Socket from './actors/socket';

import injectTapEventPlugin from 'react-tap-event-plugin';

export class ChatApp extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      rooms: "",
      current_room: false,
      user: null
    });

    // Bootstrapping
    this.routes = {
      auth: conf.routes.auth
    };

    // In order to join a room; you have to find a list of rooms in the first place
    // We get that via a /rooms/ call or via auth
    // or in this case via a mock
    this.auth = new Auth(this.routes.auth);
    this.socket = new Socket();
    this.rooms = new Rooms();

    // State is just bare models of the above components
    this.state = {
      user: '',
      rooms: [],
      current_room: null
    };
  }

  componentDidMount() {
    // Bootrap
    this.auth.authenticate()
      .then(() => this.rooms.connect(this.auth.token))
      .then(() => this.rooms.all())
      .then((rooms) => {
        // Join the first room available
        rooms[0].join().then((room)=> {
          // Update state
          this.setState({
            user: this.auth.user,
            rooms: this.rooms.rooms,
            current_room: room
          })

        });
      })
      .catch((reason)=> {
        Logger.error("ChatApp: Failed to connect. Reason: " + reason);
        throw reason;
      });
  }

  componentWillUnmount() {
    this.rooms.leave_all();
  }

  select_room(tideEvent) {
    let room = tideEvent.details;

    // Join the first room available
    room.join().then((data)=> {
      this.setState({
        current_room: room
      })
    });
  }

  send_message(tideEvent) {
    let text = tideEvent.details;
    let room = this.state.current_room;

    room.send(text);
  }


  render_welcome() {
    return (
      <div className="chat-wrapper">
        <div className="main">
          <ChatLobby rooms={this.state.rooms} user={this.state.user}/>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.current_room == null) {
      return this.render_welcome();
    }

    return (
      <div className="chat-wrapper">

        <RoomList rooms={this.state.rooms} current_room={this.state.current_room.model}/>

        <ChatRoom room={this.state.current_room.model}/>
      </div>
    )
  }
}


export default class Home extends React.Component {
  constructor(...props) {
    super(...props)
  }

  render() {
    return <div>
      <h2>Home route</h2>
      <p>you can try editing it as you like to test this out</p>

    </div>
  }
}

export const start = function (options) {
  if ('room_host' in options) {
    conf.routes.room_host = options['room_host'];
  }
  if ('auth_host' in options) {
    conf.routes.auth_host = options['auth_host'];
  }
  ReactDOM.render(
    React.createElement(ChatApp),
    document.getElementById('app'));

  // Needed for onTouchTap
  // Can go away when react 1.0 release
  // Check this repo:
  // https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();
};

export function __reload() {
  // force unload React components
  ReactDOM.render(
    React.createElement(ChatApp),
    document.getElementById('app'));
}

export default start;