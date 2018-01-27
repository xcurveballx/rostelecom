/**
 * Loading implementation using server-side Proxy. I use a free service
 * at http://www.whateverorigin.org which just returns JSON data via JSONP.
 */
import LoadManager from "./LoadManager";
import {Promise} from "./config";

export default class LoadManagerProxy extends LoadManager {
  constructor(ObserverList) {
    super(ObserverList);
    this.settings.url = "http://www.whateverorigin.org/get?url=http://81.177.101.143:30080/test.json";
  }
  load() {
    return new Promise((resolve, reject) => {
      // Lets get JSON with needed data via Proxy
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
