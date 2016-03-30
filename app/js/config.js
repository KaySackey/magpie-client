/* Served Publicly. Do not put private details here */

class Routes{
  constructor(room_host = 'localhost:8000',
              auth_host = 'localhost:8000'){
    this.room_host = room_host;
    this.auth_host = auth_host;
    this.secure = false;
  }
  url(path){
    let scheme = this.secure === false ? "http://" : "https://";
    return scheme + path;
  }
  ws(path) {
    let scheme = this.secure === false ? "ws://" : "wss://";
    return scheme + path;
  }


  get auth(){return this.url(`${this.auth_host}/api/auth/`)};
  get socket(){return this.ws(`${this.room_host}/socket`)};
  get rooms(){return this.url(`${this.room_host}/api/rooms/`)};
};

export const config = {
  routes: new Routes()
};

export default config;