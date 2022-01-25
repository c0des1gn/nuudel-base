import React from 'react';
import { StyleProp, View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { COLORS, SIZES } from '../../theme';

export interface IProps {
  size: number;
  color: string;
  animating: boolean;
  hidesWhenStopped: boolean;
  style?: StyleProp<any>;
  overflowHide: boolean;
}

export default class Loading extends React.Component<IProps> {
  static defaultProps = {
    size: SIZES.ICON_HUGE,
    color: COLORS.ICON_LIGHT,
    animating: true,
    hidesWhenStopped: true,
    overflowHide: false,
  };

  render() {
    return this.props.overflowHide ? (
      <Flow {...this.props} />
    ) : (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Flow {...this.props} />
      </View>
    );
  }
}
