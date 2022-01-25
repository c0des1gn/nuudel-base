import React from 'react';
import { View, Platform } from 'react-native';
import { IRNFormFieldProps } from './RNFormField';
import { Lookup } from '../../components';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { ControlMode } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
import MultiSelectField from './MultiSelectField';
import { COLORS, SIZES } from '../../theme';
import { styles } from './styled';
import { t } from 'nuudel-utils';

const RNFieldChoiceEdit: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  const { disabled } = storeProps(props);
  if (props.fieldSchema.FieldType !== 'MultiChoice') {
    const label = props.label || props.fieldSchema.Title;
    const options = !(props.fieldSchema.Required || props.required)
      ? props.fieldSchema.Choices
      : [{ id: '', name: 'None' }].concat(props.fieldSchema.Choices);
    return (
      <View style={styles.pickerView}>
        <Lookup
          title={''}
          enabled={!(props.disabled || disabled)}
          prompt={t('SelectOne')}
          style={{
            margin: SIZES.PADDING_SMALL, //styles.choice
          }}
          onChange={(item) => props.valueChanged(item)}
          options={options.map((value) => ({
            id: value?.id || '',
            name: value.name,
          }))}
          value={
            props.controlMode === ControlMode.New &&
            props.fieldSchema.DefaultValue &&
            !props.value
              ? props.fieldSchema.DefaultValue
              : props.value
          }
        />
      </View>
    );
  } else {
    const options = props.fieldSchema.Choices; //MultiChoices;
    let values: any[] = [];
    if (props.value) {
      if (typeof props.value === 'string') {
        values = props.value.split(',').filter((s) => s);
      } else if (props.value instanceof Array) {
        values = props.value;
      }
    }
    return (
      <MultiSelectField
        disabled={props.disabled || disabled}
        //title={JSON.stringify(props.fieldSchema) + props.value}
        items={options}
        selectedItems={
          props.controlMode === ControlMode.New &&
          props.fieldSchema.DefaultValue &&
          !props.value
            ? typeof props.fieldSchema.DefaultValue === 'string'
              ? props.fieldSchema.DefaultValue.split(',')
              : props.fieldSchema.DefaultValue
            : values
        }
        valueChanged={
          (item) => props.valueChanged(item) //getUpdatedValue(values, item)
        }
      />
    );
  }
};

function getUpdatedValue(
  oldValues: string[],
  changedItem: any //IDropdownOption,
): string {
  const changedKey = changedItem.key.toString();
  const newValues = [...oldValues];
  if (changedItem.selected) {
    // add option if it's checked
    if (newValues.indexOf(changedKey) < 0) {
      newValues.push(changedKey);
    }
  } else {
    // remove the option if it's unchecked
    const currIndex = newValues.indexOf(changedKey);
    if (currIndex > -1) {
      newValues.splice(currIndex, 1);
    }
  }
  return newValues.join(',');
}

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldChoiceEdit);
