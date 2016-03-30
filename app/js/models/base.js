import _ from 'lodash';

export class Data {
  constructor(options) {
    let values = _.defaults(options, this.constructor.defaults);
    _.assign(this, values);
  }

  static from(obj) {
    /*
     Return a properties of obj wrapped up as a new data-type
     */
    let new_obj;
    new_obj = Object.create(this.prototype);
    _.assign(new_obj, _.defaults(obj, this.defaults));
    return new_obj;
  }
}

Data.defaults = {};

export default Data;