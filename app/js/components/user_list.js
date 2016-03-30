import Component from 'tide/views';
import React, {PropTypes} from 'react';
import _ from 'lodash';

class UserListItem extends Component {
  render() {
    let u = this.props.user;
    let status = 'is-online';

    return (
      <li className="user-list--item">
        <img src={u.avatar} className={'user-list--avatar ' + status}/>
        <span className="user-list--name">{u.username}</span>
      </li>
    )
  }
}

export class UserList extends Component {
  render() {
    let users = this.props.room.users;

    return (
      <div className="user-list--section">
        <h1 className="header">Users</h1>
        <ul className="user-list">
          {
            _.map(users, (user) => <UserListItem user={user} key={user.username}/>)
          }
        </ul>
      </div>
    )
  }
}

export default UserList;