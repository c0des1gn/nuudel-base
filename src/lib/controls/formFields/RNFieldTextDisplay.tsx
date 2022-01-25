import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Text } from '../../components';
import { styles } from './styled';

const RNFieldTextDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  let value: string = props.value
    ? typeof props.value === 'string'
      ? props.value
      : JSON.stringify(props.value)
    : '';
  return <Text style={styles.display}>{value}</Text>;
};

export default RNFieldTextDisplay;
