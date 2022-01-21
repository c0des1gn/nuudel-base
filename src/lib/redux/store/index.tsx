import {
  Store,
  createStore as reduxCreateStore,
  compose,
  applyMiddleware,
} from 'redux';
//import thunk from 'redux-thunk';
//import logger from "redux-logger";

import rootReducer, {IRootState} from '../reducers';

export * from '../reducers'; //{IRootState}

export function createStore(initialState?: IRootState): Store<IRootState> {
  //const loggerMiddleware = createLogger();
  const middlewares = [
    // add additional middleware like redux-thunk here
    // thunk,
    // logger
  ];
  return reduxCreateStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middlewares)),
  );
}
