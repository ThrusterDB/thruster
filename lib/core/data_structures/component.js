"use strict";

/**
 * @author Victor O. Santos Uceta
 * Graph component super class.
 * @module lib/core/data_structures/component
 * @see module:core/data_structure/graph, core/data_structure/vertex, core/data_structure/edges
 */

const Joi = require('joi');
const Promise = require("bluebird");

/** Graph component super class */
class Component {

  /**
   * Create a template object.
   * @param {object} [param= {}] - Parameter with default value of object {}.
   */
  constructor(param = {}) {


    /* Properties for internal control of the object */
    // FIXME: Optimize the way modified properties is tracked. Also, take care of granularity of updates.
    this._internal = {

      modified : new Map(),
      fields   : new Map()

    }

    /* Component's properties */
    this._property = {};

    /* Identifier of the component */
    this._property._id = null;
    if (param.id) {
      this._property._id = param.id;
      //this.mark('id');
    };

    /* Identifier of the graph */
    this._property._graphid = null;
    if (param.graphid) {
      this._property._graphid = param.graphid;
      this.mark('_graphid');
    };

    /* Component custom attributes */
    //this._property._attributes = new Map()
    //if (param.attributes instanceof Map) {
    //  this._property._attributes = param.attributes;
    //  this.mark('attributes')
    //};

    this._property._prop = {};
    if (param.attributes) {
      this._property._prop = param.attributes;
      this.mark('attributes')
    };

    /* Component custom computed fields */
    this._property._comp = {}
    if (param.computed) {
      this._property._comp = param.computed;
      this.mark('computed')
    };

    /* Component metadata */
    this._property._meta = {}
    if (param.meta) {
      this._property._meta = param.meta;
      this.mark('meta')
    };

  }

  /**
   * Validates the Graph object schema.
   * @return {promise} A promise for the validation result.
   */
  static validate(c, schema) {
    /* return validation promise */
    return new Promise((resolve, reject)=> {
      Joi.validate(c, schema, {abortEarly: false}, (err, value)=> {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }


  /*======================== GETTERS =======================*/

  get graphid() {
    return this._property._graphid;
  }

  get id() {
    return this._property._id;
  }

  get attributes() {
    return this._property._prop;
  }

  get computed() {
    return Object.freeze(this._property._comp);
  }

  get meta() {
    return Object.freeze(this._property._meta);
  }

  get fields() {
    return this._internal.fields;
  }

  /*======================== SETTERS =======================*/

  set graphid(value) {
    this.mark('graphid');
    this._property._graphid = value;
  }

  set id(value) {
    this.mark('id');
    this._property._id = value;
  }

  set computed(value) {
    this.mark('computed');
    this._property._comp = value;
  }

  set attributes(value) {
    this.mark('attributes');
    this._property._prop = value;
  }

  set meta(value) {
    this.mark('meta');
    this._property._meta = value;
  }

  /*====================== ATTRIBUTES ======================*/

  /* Attributes collection methods */
  setAttribute(attr, value) {

    this.mark('attributes');
    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* Adding the attribute */
    this._property._prop[attr] = value;
  }

  getAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* getting the attribute */
    return this._property._prop[attr];
  }

  removeAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Removing the attribute */
    delete this._property._prop[attr];
  }

  /*======================= COMPUTED =======================*/

  setComputedAlgorithm(algo) {

    this.mark('computed');
    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (this._property._comp[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is already present');
    }
    /* adding the computed algorithm */
    this._property._comp[algo] = {};
  }

  getComputedAlgorithm(algo) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (this._property._comp[algo]) {
      throw new Error('Provided algorithm(' + algo + ') is already present');
    }
    /* getting the attribute */
    return Object.freeze(this._property._comp[algo]);
  }

  removeComputedAlgorithm(algo) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* if algo attribute exist */
    if (!this._property._comp[algo]) {
      throw new Error('Provided algorithm (' + algo + ') is not present');
    }
    /* removing the attribute */
    delete this._property._comp[algo];
  }

  /* Computed collection methods */
  setComputedAttribute(algo, attr, value) {

    this.mark('computed');
    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* if algo attribute does not exist, create it */
    if (!this._property._comp[algo]) {
      this._property._comp[algo]={};
    }
    /* Adding the attribute */
    this._property._comp[algo][attr] = value;

  }

  getComputedAttribute(algo, attr) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* if algo attribute does not exist */
    if (!this._property._comp[algo]) {
      throw new Error('Provided algorithm property(' + algo + ') is not present');
    }
    /* Getting the attribute */
    return this._property._comp[algo][attr];

  }

  removeComputedAttribute(algo, attr) {

    /* validating the algo type */
    this._validateAlgoType(algo);
    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* if algo attribute does not exist */
    if (!this._property._comp[algo]) {
      throw new Error('Provided algorithm property(' + algo + ') is not present');
    }
    /* removing the attribute */
    delete this._property._comp[algo][attr];
  }

  /*========================= META =========================*/

  /* Attributes collection methods */
  setMetaAttribute(attr, value) {

    this.mark('meta');
    /* validating the attr type */
    this._validateAttrAndVal(attr, value);
    /* Adding the attribute */
    this._property._meta[attr] = value;
  }

  getMetaAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Getting the attribute */
    return this._property._meta[attr];
  }

  removeMetaAttribute(attr) {

    /* validating the attr type */
    this._validateAttrAndVal(attr, '');
    /* Removing the attribute */
    delete this._property._meta.delete[attr];
  }

  /*====================== VALIDATION ======================*/

  /* Validation methods */
  _validateAlgoType(algo) {

    if (!/^string$/.test(typeof algo)) {
      throw new Error('Algorithm name must be of type: string');
    }
  }

  _validateAttrAndVal(attr, value) {

    /* validating the attr type */
    if (!/^string$/.test(typeof attr)) {
      throw new Error('Attribute name must be of type: string');
    }
    /* validating the value type */
    if (!/^(boolean|number|string)$/.test(typeof value) && !(value instanceof Date)) {
      throw new Error('Attribute value must be of type: boolean | number | string | Date');
    }
  }


/*====================== OPERATIONS ======================*/

  clear() {
    this._internal.modified = new Map();
  }

  mark(id){
    this._internal.modified.set(id, 0);
  }

  setMapping(id, map) {
    this._internal.fields.set(id, map);
  }


  flush() {

    let pairs = []

    this._internal.modified.forEach((val, key) => {
      let x = this._internal.fields.get(key);
      if (x) pairs.push({ id: key, map : x});
    });

    this.clear();

    return pairs;

  }


}


/* exporting the module */
module.exports = Component;
