import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { COLORS, SIZES } from '../../theme';

export interface IProps {
  style?: any;
  color?: string;
  height?: number;
}

export const Separator: FunctionComponent<IProps> = ({
  style,
  color,
  height,
}) => (
  <View
    style={[
      !style ? {} : style,
      {
        width: 1,
        borderLeftWidth: 1,
        borderLeftColor: color || COLORS.BORDER_LIGHT,
        height: height || 20,
      },
    ]}
  />
);

export default Separator;
