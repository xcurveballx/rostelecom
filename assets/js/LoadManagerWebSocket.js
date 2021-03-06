/**
 * Loading implementation using Websockets. It seems there is no corresponding endpoint on the server.
 * So, in fact, I use LoadManagerJsonp class.
 */
import LoadManager from "./LoadManager";

export default class LoadManagerWebSocket extends LoadManager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.url = 'ws://jsonplaceholder.typicode.com/photos';
  }
  load() {
    return new Promise((resolve, reject) => {
      // Lets get JSON with needed data via Websockets
      let socket = new WebSocket(this.settings.url);
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
