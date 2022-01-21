import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Input } from '@Components';
import { t } from 'nuudel-utils';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { useStyles } from './styled';
import { useTheme } from 'react-native-elements';

const RNFieldTextEdit: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  // We need to set value to empty string when null or undefined to force TextField still be used like a controlled component
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);

  return props.fieldSchema.FieldType !== 'Note' ? (
    <Input
      disabled={props.disabled || disabled}
      style={styles.text}
      key={props.fieldSchema.InternalName}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.FieldType !== 'Note' &&
        props.fieldSchema.DefaultValue &&
        typeof props.value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : value
      }
      onChangeText={(val: any) => props.valueChanged(val)} //mapDispatchToProps(val,props)
      placeholder={t('TextFormFieldPlaceholder')}
      placeholderTextColor={COLORS.PLACEHOLDER}
      maxLength={props.fieldSchema.MaxLength}
      keyboardType={
        props.fieldSchema.InternalName === 'password' &&
        Platform.OS === 'android'
          ? 'visible-password'
          : 'default'
      }
      secureTextEntry={props.fieldSchema.InternalName === 'password'}
      autoCapitalize={'none'}
      spellCheck={false}
    />
  ) : (
    <Input
      style={styles.textarea}
      //bordered={false}
      //underline={true}
      disabled={props.disabled || disabled}
      key={props.fieldSchema.InternalName}
      autoCorrect={false}
      value={value}
      //editable={true}
      multiline={true}
      onChangeText={(val: any) => props.valueChanged(val)}
      placeholder={t('TextFormFieldPlaceholder')}
      numberOfLines={4}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldTextEdit);
