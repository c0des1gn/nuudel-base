import { Appearance } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

export const AppearanceProvider = (props: any) => {
  // Declaring the state object globally.
  let initialState = {
    theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  };
  // Create a context for a user
  let Context = React.createContext(initialState);
  Context.displayName = 'AppearanceContext';
  const [context, setContext] = useState(initialState);
  const contextRef = useRef(context);

  const editContext = (preferences: any) => {
    let current = {
      ...contextRef.current,
      theme: !preferences
        ? Appearance.getColorScheme() === 'dark'
          ? 'dark'
          : 'light'
        : preferences.colorScheme,
    };
    contextRef.current = current;
    setContext(current);
  };

  useEffect(() => {
    // Add event listener
    let ar = Appearance.addChangeListener(editContext);

    // Remove event listener on cleanup
    return () => {
      ar.remove();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        ...contextRef.current,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
