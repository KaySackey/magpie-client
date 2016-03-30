import Component from 'tide/views';
import React, {PropTypes} from 'react';
import ChatForm from 'components/chat_form';
import UserList from 'components/user_list';

export class ChatLobby extends Component {

  select_room(tideEvent) {

  }



  render() {
    let title = "Magpie Chat";

    return (
      <div>
        <div className="message-window">
          <h1 className="message-window--title">Welcome to {title}</h1>

          Wait... we are loading the room list.

          Once the room list is loaded; you will be able to join.

        </div>
      </div>
    );
  }
}

export default ChatLobby;