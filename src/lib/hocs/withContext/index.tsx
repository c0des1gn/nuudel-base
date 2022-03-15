import React, { useReducer, createContext, ComponentType } from 'react';
import DeviceInfo from 'react-native-device-info';
import { ViewMode } from 'nuudel-utils';

// Declaring the state object globally.
let initialState: any = {
  sort: '',
  view: DeviceInfo.isTablet() ? ViewMode.CardList : ViewMode.List,
  theme: 'light',
};

// Create a context for a user
export const Context = createContext(initialState);
Context.displayName = 'mainContext';

const reducer = (state, action): any => {
  if (action.type === 'set' && action.payload?.prop) {
    if (action.payload.key) {
      state = {
        ...state,
        [action.payload.prop]: {
          ...state[action.payload.prop],
          [action.payload.key]: action.payload.value,
        },
      };
    } else {
      state = {
        ...state,
        [action.payload.prop]: {
          ...state[action.payload.prop],
          ...action.payload.value,
        },
      };
    }
  } else if (action.type === 'set') {
    if (action.payload?.key) {
      state = {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    } else {
      state = {
        ...action.payload?.value,
      };
    }
  } else if (action.type === 'remove' && action.payload?.key) {
    delete state[action.payload.key];
  } else if (action.type === 'reset') {
    state = { ...initialState };
  } else if (typeof action === 'object' && !action.type) {
    // assign
    state = {
      ...state,
      ...action,
    };
  }
  return state;
};

export const withContext =
  (WrappedComponent: ComponentType | any) => (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
      <Context.Provider value={state}>
        <WrappedComponent {...props} disPatch={dispatch} />
      </Context.Provider>
    );
  };

export default withContext;
