import React from 'react';
import { COLORS, SIZES } from '../../theme';
import { IRNFormFieldProps } from './RNFormField';
import { Switch } from 'react-native-elements';
import { View } from 'react-native';
import { t } from '../../loc/i18n';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { styles } from './styled';
import { connect } from 'react-redux';

const RNFieldBooleanEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  let value = props.value;
  const { disabled } = storeProps(props);
  if (
    props.controlMode === ControlMode.New &&
    typeof props.value === 'undefined'
  ) {
    value = props.fieldSchema.DefaultValue;
  }
  return (
    <View style={styles.bool}>
      <Switch
        style={styles.toggle}
        disabled={props.disabled || disabled}
        value={value === '1' || value === 'true' || value === 'Yes' || value}
        trackColor={{ false: COLORS.DISABLED, true: COLORS.SUCCESS }}
        color={COLORS.SUCCESS}
        onValueChange={(checked: boolean) => props.valueChanged(checked)}
      />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldBooleanEdit);
