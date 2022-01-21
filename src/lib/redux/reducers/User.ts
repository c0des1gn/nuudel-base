import * as CONST from '../constants';
import { IRootState, IRootAction } from './index';
import { Theme } from 'nuudel-utils';
import { Appearance } from 'react-native';

export const initialState: IUserProps = {
  userId: '',
  token: '',
  locale: 'mn-MN',
  type: 'Guest',
  theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  status: 'Active',
};
export interface IUserProps {
  userId: string;
  locale: string;
  token: string;
  type: string;
  theme: Theme;
  status: string;
}

export default (state = initialState, action: IRootAction) => {
  switch (action.type) {
    case CONST.SIGNOUT:
      return initialState;
    case CONST.SIGNIN:
      return {
        ...initialState,
        ...action.payload.obj,
      };
    case CONST.UPDATE_PROP:
      return {
        ...state,
        ...{ [action.payload.prop]: action.payload.value },
      };
    default:
      return state;
  }
};
