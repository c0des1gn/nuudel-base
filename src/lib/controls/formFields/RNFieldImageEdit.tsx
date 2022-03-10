import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Upload } from '../../components';
import { t } from '../../loc/i18n';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';

const RNFieldImageEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  // We need to set value to empty string when null or undefined to force TextField still be used like a controlled component
  const { disabled } = storeProps(props);
  const value = props.value ? props.value : { uri: '' };
  return (
    <Upload
      //isRequired={props.fieldSchema.Required}
      value={value}
      disabled={props.disabled || disabled}
      controlMode={props.controlMode}
      placeholder={''} //t('ImageFieldPlaceholder')
      valueChanged={props.valueChanged}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldImageEdit);
