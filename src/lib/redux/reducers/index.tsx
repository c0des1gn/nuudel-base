import { combineReducers, Reducer } from 'redux';
import fieldsReducer from './Fields';
import userReducer, { IUserProps } from './User';
import cart from './Cart';

export interface IRootState {
  fields: any;
  user: IUserProps;
  cart?: any;
}

export interface IRootAction {
  type: string;
  payload: any;
}

const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  fields: fieldsReducer,
  user: userReducer,
  cart,
});

export default rootReducer;
