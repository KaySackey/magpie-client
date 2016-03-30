//import Enum from 'es6-enum';
import User from '../models/users';
//const STATES = Enum('NOT_SET', 'SET', 'VALID', 'INVALID');

export class Auth{
  constructor(auth_url){
    this.auth_url = auth_url;
    this.user = null;
    this.token = null;
  //  this.state = STATES.NOT_SET;
  }

  authenticate(){
    /*
    Fetch the user and JWT

    Returns a promise.
    */
    return new Promise((resolve, reject) => {
      let http_promise = fetch(this.auth_url, {
        method: 'get',
        mode: 'cors'
      });

      http_promise
        .then((r) => r.json())
        .then(this.set.bind(this))
        .then(() =>{
          resolve(this.user);
        });

      return http_promise;
    })
  }

  set(obj){
    /*
     Set values based on an object.

     Expected format:

       status: 'ok',
       jwt: '.....',
       user: {
         "username" :"...",
         "status": "member",
         "pk": "....",
         "avatar": "..."
       }
     */
    this.user = User.from(obj.user);
    this.token = obj.jwt;
    //this.state = STATES.SET;
  }
}

export default Auth;