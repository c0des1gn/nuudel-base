import React, {
  useReducer,
  createContext,
  ComponentType,
  useContext,
} from 'react';
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
  if (action.type === 'assign') {
    state = {
      ...state,
      ...action.value,
    };
  } else if (action.type === 'set' && action.prop) {
    if (action.key) {
      state = {
        ...state,
        [action.prop]: { ...state[action.prop], [action.key]: action.value },
      };
    } else {
      state = {
        ...state,
        [action.prop]: { ...state[action.prop], ...action.value },
      };
    }
  } else if (action.type === 'set') {
    if (action.key) {
      state = {
        ...state,
        [action.key]: action.value,
      };
    } else {
      state = {
        ...action.value,
      };
    }
  } else if (action.type === 'remove' && action.key) {
    delete state[action.key];
  } else if (action.type === 'reset') {
    state = { ...initialState };
  }
  return state;
};

export const withContext =
  (WrappedComponent: ComponentType | any) => (props: any) =>
    (
      <Context.Provider value={useReducer(reducer, initialState)}>
        <WrappedComponent {...props} />
      </Context.Provider>
    );

export const useStateValue = () => useContext(Context);
export default withContext;

/*
import React, { ComponentType, useState, useRef } from 'react';
import DeviceInfo from 'react-native-device-info';
import { ViewMode } from 'nuudel-utils';

// Declaring the state object globally.
let initialState = {
  sort: '',
  view: DeviceInfo.isTablet() ? ViewMode.CardList : ViewMode.List,
  editContext: (props: any) => {},
};

// Create a context for a user
export const Context = React.createContext(initialState);
Context.displayName = 'mainContext';

const withContext = (WrappedComponent: ComponentType | any) => (props: any) => {
  const [context, setContext] = useState(initialState);
  const contextRef = useRef(context);

  const editContext = (val) => {
    val = { ...contextRef.current, ...val, editContext };
    contextRef.current = val;
    setContext(val);
  };

  return (
    <Context.Provider
      value={{
        ...contextRef.current,
        editContext,
      }}
    >
      <WrappedComponent {...props} />
    </Context.Provider>
  );
};

export default withContext;
*/
