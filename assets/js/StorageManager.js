export default class StorageManager {
  constructor(storage) {
    this.storage = storage;
  }
  // Observer method
  update(callback, data) {
    callback(data);
  }
  doSomething(data) {
    console.log(data);
  }
}
