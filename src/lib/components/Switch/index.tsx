import React, { FC } from 'react';
import { Switch as BaseSwitch, SwitchProps } from 'react-native-elements';

export const Switch: FC<SwitchProps> = ({ ...props }) => {
  return <BaseSwitch {...props} />;
};

export default Switch;
