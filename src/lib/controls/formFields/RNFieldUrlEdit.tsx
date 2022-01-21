import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Input } from 'react-native-elements';
import { ControlMode } from 'nuudel-utils';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { useStyles } from './styled';
import { connect } from 'react-redux';
import { useTheme } from 'react-native-elements';

const RNFieldUrlEdit: React.FC<IRNFormFieldProps> = (props) => {
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  const { disabled } = storeProps(props);
  return (
    <Input
      style={styles.url}
      disabled={props.disabled || disabled}
      maxLength={1024}
      value={
        props.controlMode === ControlMode.New &&
        props.fieldSchema.DefaultValue &&
        typeof props.value === 'undefined'
          ? props.fieldSchema.DefaultValue
          : props.value
      }
      keyboardType={'url'}
      autoCapitalize={'none'}
      autoCorrect={false}
      onChangeText={(val) => props.valueChanged(val)}
      placeholder={t('UrlFormFieldPlaceholder')}
      placeholderTextColor={COLORS.PLACEHOLDER}
      autoCompleteType={'off'}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldUrlEdit);
