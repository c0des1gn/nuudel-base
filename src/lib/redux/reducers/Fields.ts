import * as CONST from '../constants';
import {IRootState, IRootAction} from './index';
export const initialState: any = {};

export default (state = initialState, action: IRootAction) => {
  switch (action.type) {
    case CONST.ADD_FIELD:
      return {
        ...state,
        ...{[action.payload.content.field]: action.payload.content},
      };
    case CONST.SET_FIELDS:
      return action.payload.fields;
    case CONST.CHANGE_PROP:
      return {
        ...state,
        ...{
          [action.payload.name]: {
            ...state[action.payload.name],
            ...{
              [action.payload.prop]: action.payload.value,
            },
          },
        },
      };
    case CONST.ON_SELECT:
      return {
        ...state,
        ...{
          [action.payload.name]: {
            ...state[action.payload.name],
            ...{
              value: action.payload.value,
            },
          },
        },
      };
    case CONST.ON_CHANGE:
      return {
        ...state,
        ...{
          [action.payload.name]: {
            ...state[action.payload.name],
            ...{
              value: action.payload.value,
            },
          },
        },
      };
    default:
      return state;
  }
};
