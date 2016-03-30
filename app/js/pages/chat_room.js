import _ from 'lodash';
import Component from 'tide/views';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ChatForm from 'components/chat_form';
import UserList from 'components/user_list';
import SimpleMessage from 'components/simple_message';
import Logger from 'tide/logger';

export class ChatRoom extends Component {
  render() {
    let room = this.props.room;

    /*
     In history, messages are returned in the order of the most recent message first.
     This allows us to add to add the most recent messages to the chat box first; since they are most important to catching the user up on context.

     However as we get new messages, they might be out of order so we keep this sorted.
     */
    const sorted_messages = _.sortBy(room.messages, (u) => u.pk);
    const rendered_messages = _.map(sorted_messages, (message, index) => {
      return <SimpleMessage key={message.pk} message={message} active={index == sorted_messages.length - 1} />;
    });

    Logger.debug(`length messages: ${room.messages.length}`);
    Logger.debug(`length users: ${room.users.length}`);

    return (
      <div className="chat-room">
        <h1 className="chat-room--title">{room.topic}</h1>

        <div className="message-window">
          {rendered_messages}
        </div>

        <UserList room={room}/>

        <ChatForm />
      </div>
    );
  }

}

export default ChatRoom;