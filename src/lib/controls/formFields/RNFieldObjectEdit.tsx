import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Input } from 'react-native-elements';
import { t } from '../../loc/i18n';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { TouchableHighlight, View } from 'react-native';
import { styles } from './styled';
import { connect } from 'react-redux';
import { COLORS, SIZES } from '../../theme';

const RNFieldObjectEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  // We need to set value to empty string when null or undefined to force TextField still be used like a controlled component
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);
  return !props.fieldSchema.IsArray ? (
    <Input
      autoCompleteType=""
      style={styles.object}
      disabled={props.disabled || disabled}
      key={props.fieldSchema.InternalName}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.FieldType !== 'Note' &&
        props.fieldSchema.DefaultValue &&
        typeof props.value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : value
      }
      onChangeText={(val: any) => props.valueChanged(val)}
      placeholder={t('TextFormFieldPlaceholder')}
      placeholderTextColor={COLORS.PLACEHOLDER}
      maxLength={props.fieldSchema.MaxLength}
      keyboardType={
        props.fieldSchema.InternalName === 'password'
          ? 'visible-password'
          : 'default'
      }
    />
  ) : (
    <></>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldObjectEdit);
