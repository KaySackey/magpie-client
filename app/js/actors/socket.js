import {Socket as PhxSocket, Channel as PhxChannel} from 'phoenix-socket';
import Logger from 'tide/logger';
import conf from 'configuration';

export class Socket {


  static connect(name, token) {

    let host = conf.routes.socket;
    let params = {'jwt': token};

    return new Promise((resolve, reject) => {

      if (!window.WebSocket) {
        reject('Socket: Cannot proceed. Websockets required!');
      }


      let ws = new PhxSocket(host, params);

      // No rejection from this promise
      // The socket will continue trying to connect until it finally does

      ws.onOpen(() =>{
        Logger.debug("Socket: The connection openned");
        resolve(ws);
      });

      // Errors
      ws.onError(() => {
        Logger.error("Socket: There was an error with the connection!");
      });

      ws.onClose(() => {
        Logger.error("Socket: The connection dropped!");
      });

      // Debugging
      ws.onMessage((msg) => Logger.debug("Socket: Got message", msg));

      // Run connect
      ws.connect(params);
    });
  }
}

export default Socket;