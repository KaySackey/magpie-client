import {observer} from 'mobx-react';
import React, {Component as ReactComponent} from 'react';
import ReactDom from 'react-dom';

class TideEvent {
  /*
   - name: what is this event called
   -  currentTarget—- representing whom the event handler has attached to (basically this if your event is being handled by the function you are in).
   - target: who dispatched the event
   — detail: some details about event (e.g. current click count)
   - bubbles: does this bubble up through the DOM
   - cancelable: can we cancel this?
   - timeStamp
   */

  constructor(name, target, details) {
    this.name = name;
    this.target = target;
    this.details = details;

    this.bubbles = true;
    this.cancelable = false;
  }

  stopPropagation() {
    this.bubbles = false;
  }

  allowPropagation() {
    this.bubbles = true;
  }
}

const MobxObserver = observer(ReactComponent);

export class Component extends MobxObserver {

  constructor(props) {
    /*
     We're subclassing something so the displayName = MiddleC thanks to Mobservable munging.
     So lets set the displayName back to what it's supposed to be.
     */
    super(props);
    this.__proto__.constructor.displayName = this.__proto__.constructor.name;
  }

  getChildContext() {
    return {parent: this}
  }

  // Not supported in IE8. IE8 support has been dropped from React 0.15+
  get parent() {
    return this.getParent();
  }

  // IE8 Support
  getParent() {
    return this.context.parent;
  }

  trigger(eventName, details = {}) {
    let e = new TideEvent(eventName, this, details);
    this.handleEvents(e)
  }

  handleEvents(e) {
    e.currentTarget = this;
    let value = null;

    if (e.name in this) {
      console.log('Calling ', e.name, ' on ', this);
      value = this[e.name].call(this, e);
    }
    if (e.bubbles) {
      const parent = e.currentTarget.parent;

      if (parent == undefined && parent == null) {
        console.log('Terminal ', e.name, ' on ', this.constructor.name);
      }
      else {
        console.log('Bubbling ', e.name, ' on ', this.constructor.name, ' --> ', parent);
        parent.handleEvents(e);
      }
    }

    return value;
  }
}


Component.contextTypes = {
  parent: React.PropTypes.object
};

Component.childContextTypes = {
  parent: React.PropTypes.object
};


export default Component;