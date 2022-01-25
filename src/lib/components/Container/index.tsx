import React, { FC } from 'react';
import { styles } from '../../theme/styles';
import { StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../../theme';

export interface IProps {
  children: any;
  style?: any;
  isCenter?: boolean | undefined;
}

export const Container: FC<IProps> = ({
  children,
  isCenter = undefined,
  ...props
}) => {
  const styleCenter =
    typeof isCenter !== 'undefined'
      ? {
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {};

  let style = {
    backgroundColor: COLORS.BACKGROUND,
    ...styleCenter,
  };

  return (
    <View
      {...props}
      style={StyleSheet.flatten([styles.Container, style, props.style])}
    >
      {children}
    </View>
  );
};

export default Container;
