import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../../theme';

const styles = StyleSheet.create({
  root: {
    borderBottomColor: COLORS.BORDER,
    borderBottomWidth: SIZES.BORDER_WIDTH,
  },
});

export const Hr: FC<any> = ({ ...props }) => {
  return <View style={[styles.root, props.style]} />;
};

export default Hr;
