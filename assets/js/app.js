"use strict";
import ObserverList from './ObserverList';
import LoadManagerProxy from './LoadManagerProxy';
import StorageManager from './StorageManager';

let loadManager = new LoadManagerProxy(new ObserverList());
let storageManager = new StorageManager('rostelecom');

const config = [{
    instance: loadManager,
    notifies: [{
      name: 'test',
      observers: [{
        instance: storageManager,
        callback: storageManager.doSomething
      }]
    }]
}];

config.forEach(subject => {
  subject.notifies.forEach(evt => {
    evt.observers.forEach(observer => {
      subject.instance.addObserver(evt.name, observer.instance, observer.callback);
    });
  });
});

let promise = loadManager.load();

Promise.all([promise]).then(
    result => loadManager.notify('test', result),
    error => loadManager.notify('test', error)
);
