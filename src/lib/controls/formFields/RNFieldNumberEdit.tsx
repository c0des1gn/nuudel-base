import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Input } from '@Components';
import { ControlMode } from 'nuudel-utils';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import { useStyles } from './styled';
import { getLocale } from './RNFieldDateEdit';
import { useTheme } from 'react-native-elements';

const RNFieldNumberEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  // We need to set value to empty string when null or undefined to force TextField
  // not to be used like an uncontrolled component and keep current value
  const value = props.value ? props.value : '';
  const { disabled } = storeProps(props);
  return (
    <Input
      style={styles.number}
      disabled={props.disabled || disabled}
      maxLength={props.fieldSchema.MaxLength}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.DefaultValue &&
        typeof value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : isNaN(value)
          ? value
          : value.toString()
      }
      autoCapitalize="none"
      keyboardType={
        props.fieldSchema.keyboardType === 'decimal-pad'
          ? 'decimal-pad'
          : 'numeric'
      }
      onChangeText={(val: any) => props.valueChanged(parseNumber(val))}
      placeholder={'0'}
      placeholderTextColor={COLORS.PLACEHOLDER}
    />
  );
};

const parseNumber = (value, locale = getLocale()): number => {
  const decimalSperator = Intl.NumberFormat(locale).format(1.1).charAt(1);
  // const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
  const cleanPattern = new RegExp(
    `[${"' ,.".replace(decimalSperator, '')}]`,
    'g'
  );
  const cleaned = value.replace(cleanPattern, '');
  const normalized = cleaned.replace(decimalSperator, '.');
  return Number(normalized);
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldNumberEdit);
