/**
* Main flow of the app.
*/
"use strict";
import {loadManager, viewManager, storageManager, eventManager, Promise} from "./config";

try {
  let json = storageManager.isEmpty() ? loadManager.load() : Promise.resolve(false),
      dom = viewManager.ready();

  Promise.all([json, dom])
  .then(result => {
    try {
      loadManager.notify('dataLoaded', result[0]);
      eventManager.setEventHandlers(storageManager);
      eventManager.notify('handlersReady', storageManager.restore());
    } catch(e) {
      eventManager.notify('showError', e);
    }
  }, error => {
    eventManager.notify('showError', error);
  });
} catch(e) {
  eventManager.notify('showError', e);
}
