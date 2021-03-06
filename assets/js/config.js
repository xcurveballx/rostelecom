/**
 * Config variable establishes Subject-Observer relashionships.
 */
let Promise = require('es6-promise-polyfill').Promise;
import ObserverList from './ObserverList';
import ViewManager from './ViewManager';
import EventManager from './EventManager';
import LoadManagerJsonp from './LoadManagerJsonp';
import StorageManager from './StorageManager';


let loadManager = new LoadManagerJsonp(new ObserverList());
let viewManager = new ViewManager(new ObserverList());
let storageManager = new StorageManager(new ObserverList());
let eventManager = new EventManager(new ObserverList());

const config = [
  {
    instance: loadManager, // Subject, will inform the dependants
    notifies: [{
      name: 'dataLoaded',  // message
      observers: [{
        instance: storageManager,
        callback: storageManager.save
      }]
    }]
  },
  {
    instance: eventManager,
    notifies: [{
      name: 'handlersReady',
      observers: [{
        instance: viewManager,
        callback: viewManager.renderView
      }]
    },{
      name: 'showMore',
      observers: [{
        instance: viewManager,
        callback: viewManager.renderItems
      }]
    },{
      name: 'showError',
      observers: [{
        instance: viewManager,
        callback: viewManager.renderErrorView
      }]
    },{
      name: 'removeElem',
      observers: [{
        instance: storageManager,
        callback: storageManager.removeItemId
      },{
        instance: viewManager,
        callback: viewManager.deleteItem
      }]
    }]
  }

];
eventManager.setObservers(config);
export {loadManager, viewManager, storageManager, eventManager, Promise};
