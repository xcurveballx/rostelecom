import LoadManager from "./LoadManager";

export default class LoadManagerProxy extends LoadManager {
  constructor(ObserverList) {
    super(ObserverList);
    this.url = "http://www.whateverorigin.org/get?url=http://81.177.101.143:30080/test.json";
  }
  // General functionality
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
      script.src = this.url + (~this.url.indexOf('?') ? '&' : '?') + 'callback=' + callbackName;
      document.body.appendChild(script);
      script.onerror = function(error) {
        reject(error);
      }
    });
  }
}
