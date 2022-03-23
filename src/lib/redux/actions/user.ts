import * as CONST from '../constants';

const dispatcher = (action, dispatch?) => {
  return dispatch ? dispatch(action) : action;
};

export const sign_in = (obj, dispatch?) =>
  dispatcher(
    {
      type: CONST.SIGNIN,
      payload: {
        obj,
      },
    },
    dispatch
  );

export const sign_out = (dispatch?) =>
  dispatcher(
    {
      type: CONST.SIGNOUT,
      payload: {},
    },
    dispatch
  );

export const updateProp = (prop: string, value, dispatch?) =>
  dispatcher(
    {
      type: CONST.UPDATE_PROP,
      payload: {
        prop,
        value,
      },
    },
    dispatch
  );

export const updateProps = (obj, dispatch?) =>
  dispatcher(
    {
      type: CONST.MERGE_PROPS,
      payload: obj,
    },
    dispatch
  );
