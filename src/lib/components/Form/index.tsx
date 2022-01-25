import React, { FC } from 'react';
import { View } from 'react-native';
import { styles } from '../../theme/styles';
import { StyleSheet } from 'react-native';

interface IFormProps {
  style?: any;
}

export const Form: FC<IFormProps> = ({ children, ...props }) => {
  return (
    <View {...props} style={StyleSheet.flatten([styles.Form, props.style])}>
      {children}
    </View>
  );
};

export default Form;
