import * as CONST from '../constants';

export const getValue = (name, value) => ({
  type: CONST.ON_CHANGE,
  payload: {
    name,
    value,
  },
});

export const getSelected = (name, value) => ({
  type: CONST.ON_SELECT,
  payload: {
    name,
    value,
  },
});

export const changeProp = (name, prop, value) => ({
  type: CONST.CHANGE_PROP,
  payload: {
    name,
    prop,
    value,
  },
});

export const addField = content => ({
  type: CONST.ADD_FIELD,
  payload: {
    content,
  },
});

export const setFields = fields => ({
  type: CONST.SET_FIELDS,
  payload: {
    fields,
  },
});
