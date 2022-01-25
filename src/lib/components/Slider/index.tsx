import React, { FC } from 'react';
import NumberSlider, { SliderProps } from '@react-native-community/slider';
import { styles } from '../../theme/styles';
import { COLORS, SIZES } from '../../theme';

export const Slider: FC<SliderProps> = ({ ...props }) => {
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
