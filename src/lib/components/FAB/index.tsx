import React, { FC } from 'react';
import { FAB as BaseFAB, FABProps } from 'react-native-elements';

export const FAB: FC<FABProps> = ({ ...props }) => {
  return <BaseFAB {...props} />;
};

export default FAB;
