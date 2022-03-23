import * as CONST from '../constants';
import { IRootState, IRootAction } from './index';
import { Theme, MarketType } from 'nuudel-utils';
import { Appearance } from 'react-native';

export const initialState: IUserProps = {
  userId: '',
  token: '',
  locale: 'mn-MN',
  type: 'Guest',
  theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  status: 'Active',
  currency: 'MNT',
  rates: [],
  filters: {},
  market: MarketType.Ebay,
};
export interface IUserProps {
  userId: string;
  locale: string;
  token: string;
  type: string;
  theme: Theme;
  status: string;
  currency: string;
  rates?: any;
  filters?: any;
  market?: MarketType;
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
    case CONST.MERGE_PROPS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
