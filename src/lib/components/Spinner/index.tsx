import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import { _COLORS, _SIZES } from '../../theme';

interface IProps extends ActivityIndicatorProps {
  overflowHide: boolean;
}

class Spinner extends React.Component<IProps> {
  static defaultProps = {
    size: 'large',
    color: _COLORS.LOADER,
    animating: true,
    hidesWhenStopped: true,
    overflowHide: false,
  };

  render() {
    const { overflowHide } = this.props;
    return overflowHide ? (
      <ActivityIndicator {...this.props} />
    ) : (
      <View
        style={{
          zIndex: 999,
          elevation: 999,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator {...this.props} />
      </View>
    );
  }
}

export default Spinner;
