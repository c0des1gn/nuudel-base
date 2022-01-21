import React from 'react';
import {IRNFormFieldProps} from './RNFormField';
import {mapDispatchToProps, mapStateToProps, storeProps} from './RNFieldCore';
import {getValue, changeProp} from '../../redux/actions/fields';
import {connect} from 'react-redux';
import LookupField from './LookupField';

const RNFieldLookupEdit: React.FunctionComponent<IRNFormFieldProps> = props => {
  const {disabled} = storeProps(props);
  return <LookupField {...props} disabled={props.disabled || disabled} />;
};

function getUpdatedValue(
  oldValues: Array<{key: number; text: string}>,
  changedItem: any, //IDropdownOption,
): string {
  let newValues: Array<{key: number; text: string}>;
  if (changedItem.selected) {
    newValues = [
      ...oldValues,
      {key: Number(changedItem.key), text: changedItem.text},
    ];
  } else {
    newValues = oldValues.filter(item => item.key !== changedItem.key);
  }
  return newValues.reduce(
    (valStr, item) => valStr + `${item.key};#${item.text}`,
    '',
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RNFieldLookupEdit);
