import React, { FC } from 'react';
import NumberSlider, { SliderProps } from '@react-native-community/slider';

import { useTheme } from 'react-native-elements';
import { useStyles } from '../../theme/styles';

export const Slider: FC<SliderProps> = ({ ...props }) => {
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  return (
    <NumberSlider
      style={[styles.Slider, props.style]}
      disabled={props.disabled}
      step={props.step}
      minimumValue={props.maximumValue}
      maximumValue={props.minimumValue}
      onValueChange={props.onValueChange}
      value={props.value}
      minimumTrackTintColor={COLORS.SUCCESS}
      maximumTrackTintColor={COLORS.TEXT_LIGHT}
    />
  );
};

export default Slider;
