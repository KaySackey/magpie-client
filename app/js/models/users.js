import {Data} from './base';

export class User extends Data {

}

Data.defaults = {
  pk: 0,
  username: '',
  avatar: '',
  status: ''
};

export default User;