/**
 * Loading implementation using HTTP link to get data via JSONP.
 */
import LoadManager from "./LoadManager";
import {Promise} from "./config";

export default class LoadManagerJsonp extends LoadManager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.url = "http://jsonplaceholder.typicode.com/photos";
  }
  load() {
    return new Promise((resolve, reject) => {
      // Lets get JSON with needed data via JSONP
      let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        resolve(data);
      };

      let script = document.createElement('script');
      script.src = this.settings.url + (~this.settings.url.indexOf('?') ? '&' : '?') + 'callback=' + callbackName;
      document.body.appendChild(script);
      script.onerror = (error) => reject(error);
    });
  }
}
