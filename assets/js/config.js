/*
 * Config variable establishes Subject-Observer relashionships.
 */
import ObserverList from './ObserverList';
import ViewManager from './ViewManager';
import EventManager from './EventManager';
import LoadManagerProxy from './LoadManagerProxy';
import StorageManager from './StorageManager';

let loadManager = new LoadManagerProxy(new ObserverList());
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
    },{
      name: 'totalNum',
      observers: [{
        instance: eventManager,
        callback: eventManager.setTotal
      }]
    }]
  },
  {
    instance: viewManager,
    notifies: [{
      name: 'domReady',
      observers: [{
        instance: eventManager,
        callback: eventManager.setHandlers
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
      name: 'removeElem',
      observers: [{
        instance: storageManager,
        callback: storageManager.removeItemId
      }]
    }]
  }

];
eventManager.setObservers(config);
export {loadManager, viewManager, storageManager, eventManager};
