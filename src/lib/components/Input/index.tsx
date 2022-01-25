import React, { FunctionComponent } from 'react';
import { Input as BaseInput, InputProps } from 'react-native-elements';
import { styles } from '../../theme/styles';
import { StyleSheet } from 'react-native';

export const Input: FunctionComponent<InputProps> = ({ ...props }) => {
  return (
    <BaseInput
      autoCompleteType={'off'}
      {...props}
      style={StyleSheet.flatten([styles.Input, props.style])}
    />
  );
};

export default Input;
