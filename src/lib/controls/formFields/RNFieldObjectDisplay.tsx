import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Text } from 'react-native-elements';
import { useStyles } from './styled';

const RNFieldObjectDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  const styles = useStyles(props);
  let value: string = props.value
    ? typeof props.value === 'object'
      ? JSON.stringify(props.value)
      : props.value
    : '';

  return <Text style={styles.display}>{value}</Text>;
};

export default RNFieldObjectDisplay;
