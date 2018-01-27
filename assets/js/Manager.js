/**
* This class holds common properties and then every *Manager extends it.
*/
import SubjectObserver from "./SubjectObserver";

export default class Manager extends SubjectObserver {
  constructor(ObserverList) {
    super(ObserverList);
    // common settings. Each child can alter/add new ones as needed
    this.settings = {
      appId: 'container',
      itemsId: 'items',
      loadingClass: 'loading',
      perRow: 4
    }
  }
}
// kinda static variable
Manager.total = 0;
