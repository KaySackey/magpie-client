import Component from 'tide/views';
import React, {PropTypes} from 'react';
import _ from 'lodash';

export class RoomList extends Component {
  select_room(tideEvent) {
    let room = tideEvent.details;
    room.model.joined = true;
  }

  room_class(room) {
    let className = ['room-name'];

    if(this.props.current_room &&
       room.pk == this.props.current_room.pk){
      className.push('current-room')
    }
    else if (room.joined) {
      className.push('selected');
    }
    return className.join(' ');
  }

  render() {
    return (
      <div className="room-list">
        <ul className="room-group">
          <h1 className="header">Chat Rooms</h1>
          {_.map(this.props.rooms, (room) => {
            let boundClick = this.trigger.bind(this, 'select_room', room);
            let model = room.model;
            return (<li key={model.slug}
                        className={this.room_class(model)}
                        onClick={boundClick}>{model.topic}</li>);
          })}
        </ul>
      </div>
    )
  }
}

export default RoomList;