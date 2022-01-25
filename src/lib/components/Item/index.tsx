import React, { FC } from 'react';
import { styles } from '../../theme/styles';
import { StyleSheet, View } from 'react-native';

interface IItemProps {
  style?: any;
  error?: boolean;
}

export const Item: FC<IItemProps> = ({ children, ...props }) => {
  return (
    <View {...props} style={StyleSheet.flatten([styles.Item, props.style])}>
      {children}
    </View>
  );
};

export default Item;
