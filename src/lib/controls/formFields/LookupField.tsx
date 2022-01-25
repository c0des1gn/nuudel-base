import React from 'react';
import { View, Platform } from 'react-native';
import { Lookup } from '../../components';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MultiSelectField from './MultiSelectField';
import { ControlMode } from 'nuudel-utils';
import { t } from 'nuudel-utils';
import { IRNFormFieldProps } from './RNFormField';
import { ListFormService } from '../../services/ListFormService';

export interface ILookupFieldProps extends IRNFormFieldProps {
  disabled: boolean;
}

export interface ILookupFieldState {
  options: any[];
}

class LookupField extends React.Component<
  ILookupFieldProps,
  ILookupFieldState
> {
  constructor(props: ILookupFieldProps) {
    super(props);
    this.state = {
      options: [],
    };
    if (props.fieldSchema.JsonOption && props.fieldSchema.JsonOption.list) {
      ListFormService.getDataAll(
        props.fieldSchema.JsonOption.list,
        [props.fieldSchema.JsonOption.column],
        props.client
      ).then((r) => {
        if (r && r instanceof Array) {
          let choices: any[] = r.map((option) => ({
            id: option._id,
            name: option[this.props.fieldSchema.JsonOption.column],
          }));

          if (this.props.fieldSchema.FieldType !== 'LookupMulti') {
            if (!(this.props.required || this.props.fieldSchema.Required)) {
              choices = [{ id: 0, name: t('LookupEmptyOptionText') }].concat(
                choices
              );
            }
          }
          this.setState({ options: choices });
        }
      });
    }
  }

  render() {
    if (this.props.fieldSchema.FieldType !== 'LookupMulti') {
      const value = this.props.value ? this.props.value : '';
      return (
        <View>
          <Lookup
            title={''}
            enabled={!this.props.disabled}
            prompt={t('SelectOne')}
            onChange={(val) => this.props.valueChanged(val)}
            options={this.state.options.map((value) => ({
              id: !value?.id ? '' : value.id + '::' + value.name,
              name: value.name,
            }))}
            value={
              this.props.controlMode === ControlMode.New &&
              this.props.fieldSchema.DefaultValue
                ? this.props.fieldSchema.DefaultValue
                : value
            }
          />
        </View>
      );
    } else {
      let values: any[] = [];
      if (this.props.value) {
        if (
          typeof this.props.value === 'string' ||
          this.props.value instanceof String
        ) {
          values = this.props.value.split(',').filter((s) => s);
        } else if (this.props.value instanceof Array) {
          values = this.props.value;
        }
      }
      return (
        <MultiSelectField
          disabled={this.props.disabled}
          items={this.state.options}
          selectedItems={
            this.props.controlMode === ControlMode.New &&
            this.props.fieldSchema.DefaultValue &&
            typeof this.props.value === 'undefined'
              ? typeof this.props.fieldSchema.DefaultValue === 'string'
                ? this.props.fieldSchema.DefaultValue.split(',')
                : this.props.fieldSchema.DefaultValue
              : values
          }
          valueChanged={(item) => this.props.valueChanged(item)}
        />
      );
    }
  }
}

export default LookupField;
