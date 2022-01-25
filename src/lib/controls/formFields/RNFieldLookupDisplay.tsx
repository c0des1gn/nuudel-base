import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Linking, TouchableOpacity } from 'react-native';
import { Text } from '../../components';
import { styles } from './styled';

const RNFieldLookupDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  if (props.value && props.value.length > 0) {
    let value = props.value;
    if (typeof props.value === 'string') {
      value = [value];
    }
    const baseUrl = `#`;
    return (
      <>
        {value.map((val, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              Linking.openURL(`${baseUrl}&ID=${val.lookupId}`);
            }}
          >
            {index > 1 && <Text>,</Text>}
            <Text style={styles.display}>
              {typeof val.lookupValue !== 'undefined' ? val.lookupValue : val}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );
  } else {
    return <></>;
  }
};

export default RNFieldLookupDisplay;
