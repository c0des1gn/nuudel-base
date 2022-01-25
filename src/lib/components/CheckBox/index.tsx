import React, { FC } from 'react';
import { CheckBox as BaseCheckBox, CheckBoxProps } from 'react-native-elements';

export const CheckBox: FC<CheckBoxProps> = ({ ...props }) => {
  return <BaseCheckBox {...props} />;
};

export default CheckBox;
