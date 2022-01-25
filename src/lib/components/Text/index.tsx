import React, { FunctionComponent } from 'react';
import { Text as BaseText, TextProps } from 'react-native-elements';
import { styles } from '../../theme/styles';
import { StyleSheet } from 'react-native';

export const Text: FunctionComponent<TextProps> = ({ children, ...props }) => {
  return (
    <BaseText {...props} style={StyleSheet.flatten([styles.Text, props.style])}>
      {children}
    </BaseText>
  );
};

export const H1: FunctionComponent<TextProps> = ({ children, ...props }) => {
  return (
    <Text {...props} style={StyleSheet.flatten([styles.H1, props.style])}>
      {children}
    </Text>
  );
};

export const Label: FunctionComponent<TextProps> = ({ children, ...props }) => {
  return (
    <Text {...props} style={StyleSheet.flatten([styles.Label, props.style])}>
      {children}
    </Text>
  );
};

export default Text;
