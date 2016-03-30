import Component from 'tide/views';
import React, {PropTypes} from 'react';

export class ChatForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text || ''
    }
  }

  handle_text_change(e) {
    this.setState({text: e.target.value});
  }

  trigger_send_message(e) {
    // Handle the native event, then trigger a Tide Event
    e.preventDefault();

    let text = this.state.text.trim();
    if (!text) {
      return false;
    }

    this.trigger('send_message', text);

    this.setState({text: ''});
  }

  render() {
    return (
      <form className="chat-form" onSubmit={this.trigger_send_message.bind(this)}>
        <input placeholder="Type a message here" name="body" type="text" className="inline"
               value={this.state.text}
               onChange={this.handle_text_change.bind(this)}/>
        <input className="button" type="submit" className="inline" value="Send"/>
      </form>
    )
  }
}

export default ChatForm;