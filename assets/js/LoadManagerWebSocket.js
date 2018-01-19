import LoadManager from "./LoadManager";

export default class LoadManagerWebSocket extends LoadManager {
  constructor(ObserverList) {
    super(ObserverList);
    this.url = 'ws://81.177.101.143:30080/test.json';
  }
  // General functionality
  load() {
    return new Promise((resolve, reject) => {
      // Lets get JSON with needed data via Websockets
      let socket = new WebSocket(this.url);
      socket.onmessage = function(event) {
        resolve(event.data);
      };
      socket.onerror = function(error) {
        reject(error);
      };
      socket.onclose = function(event) {
        if(!event.wasClean) reject(event);
      };
    });
  }
}
