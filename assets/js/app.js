"use strict";
import {loadManager, viewManager, storageManager, eventManager} from "./config";

let json = storageManager.isEmpty() ? loadManager.load() : Promise.resolve(false),
    dom = viewManager.ready();

Promise.all([json, dom])
.then(result => {
  loadManager.notify('dataLoaded', result[0]['contents']);
  loadManager.notify('totalNum', storageManager.totalNum());
  eventManager.setEventHandlers(storageManager);
  eventManager.notify('handlersReady', storageManager.restore());
}, error => {
  loadManager.notify('test', error);
});
