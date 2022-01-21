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
Context.displayName = 'ndlContext';

const reducer = (state, action): any => {
  switch (action.type) {
    case 'changeTheme':
      return {
        ...state,
        theme: action.newTheme,
      };

    default:
      return state;
  }
};

export const withReducer =
  (WrappedComponent: ComponentType | any) => (props: any) =>
    (
      <Context.Provider value={useReducer(reducer, initialState)}>
        <WrappedComponent {...props} />
      </Context.Provider>
    );

export const useStateValue = () => useContext(Context);
export default withReducer;
