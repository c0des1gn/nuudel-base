import React, { forwardRef, FC } from 'react';
import { Input as BaseInput, InputProps } from 'react-native-elements';
import { styles } from '../../theme/styles';
import { StyleSheet, TextInput } from 'react-native';

export const Input: FC<InputProps> = forwardRef<TextInput, InputProps>(
  (props, ref) => {
    return (
      <BaseInput
        autoCompleteType="off"
        {...props}
        ref={ref}
        style={StyleSheet.flatten([styles.Input, props.style])}
      />
    );
  }
);

export default Input;
