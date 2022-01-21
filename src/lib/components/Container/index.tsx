import React, { FC } from 'react';
import { useStyles } from '../../theme/styles';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-elements';

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
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
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
