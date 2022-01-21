import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { makeStyles } from 'react-native-elements';

const getStyle: Function = (COLORS, SIZES): any => {
  return {
    root: {
      borderBottomColor: COLORS.BORDER,
      borderBottomWidth: SIZES.BORDER_WIDTH,
    },
  };
};

const useStyles = makeStyles((theme, props?: any) => {
  const { COLORS, SIZES } = theme as any;
  return getStyle(COLORS, SIZES);
});

export const Hr: FC<any> = ({ ...props }) => {
  const styles = useStyles(props);
  return <View style={[styles.root, props.style]} />;
};

export default Hr;
