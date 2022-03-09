import React, { useEffect } from 'react';
import { Pressable as PressAble, PressableProps } from 'react-native';
import Text from '../Text';

interface IPressableProps extends PressableProps {
  timeout?: number;
  styleText?: any;
}

const Pressable: React.FC<IPressableProps> = ({
  onPress,
  timeout = 1000,
  children,
  styleText,
  ...props
}) => {
  let _debounce: any = undefined;
  useEffect(() => {
    //function cleanup()
    return () => {
      clearTimeout(_debounce);
    };
  }, []);

  const onClick = (e: any) => {
    if (onPress) {
      if (timeout >= 0) {
        if (!_debounce) {
          onPress(e);
        } else {
          clearTimeout(_debounce);
        }
        _debounce = setTimeout(() => {
          _debounce = undefined;
        }, timeout);
      } else {
        onPress(e);
      }
    }
  };

  return (
    <PressAble {...props} onPress={onClick}>
      {React.isValidElement(children) ? (
        children
      ) : typeof children === 'string' ? (
        <Text style={styleText}>{children}</Text>
      ) : (
        children
      )}
    </PressAble>
  );
};

export default Pressable;
