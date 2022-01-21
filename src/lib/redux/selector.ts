import * as CONST from './constants';

export const getFieldByName = (store, name) => {
  const flds = store.hasOwnProperty('fields') ? store.fields : store;
  if (flds instanceof Array) {
    const fld = flds.filter(f => f.hasOwnProperty('field') && f.field === name);
    return fld.length > 0 ? fld[0] : {};
  } else return !!flds && flds.hasOwnProperty(name) ? flds[name] : {};
};

/**
 * Fields of a slightly more complex selector
 * select from store combining information from multiple reducers
 */
export const getFields = store =>
  store.hasOwnProperty('fields') ? store.fields : {};
