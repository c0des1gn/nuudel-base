import React from 'react';
import moment from 'moment';
import { ControlMode, DisplayType } from 'nuudel-utils';
import { IFieldSchema } from '../../services/datatypes/RenderListData';
import { t } from 'nuudel-utils';
import FormField, { IFormFieldProps } from './FormField';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Label, Text, Input } from '../../components';

import RNFieldTextEdit from './RNFieldTextEdit';
import RNFieldChoiceEdit from './RNFieldChoiceEdit';
import RNFieldNumberEdit from './RNFieldNumberEdit';
import RNFieldDateEdit from './RNFieldDateEdit';
import RNFieldBooleanEdit from './RNFieldBooleanEdit';
import RNFieldTextDisplay from './RNFieldTextDisplay';
import RNFieldImageDisplay from './RNFieldImageDisplay';
import RNFieldImageEdit from './RNFieldImageEdit';
import RNFieldUrlDisplay from './RNFieldUrlDisplay';
import RNFieldUrlEdit from './RNFieldUrlEdit';
import RNFieldLookupDisplay from './RNFieldLookupDisplay';
import RNFieldLookupEdit from './RNFieldLookupEdit';
import RNFieldObjectDisplay from './RNFieldObjectDisplay';
import RNFieldObjectEdit from './RNFieldObjectEdit';

const EditFieldTypeMappings: {
  [fieldType: string]: React.StatelessComponent<IRNFormFieldProps>;
} = {
  Text: RNFieldTextEdit,
  Note: RNFieldTextEdit,
  Lookup: RNFieldLookupEdit,
  LookupMulti: RNFieldLookupEdit,
  Choice: RNFieldChoiceEdit,
  MultiChoice: RNFieldChoiceEdit, //array
  Number: RNFieldNumberEdit,
  Currency: RNFieldNumberEdit, // түр дээ ашигалаагүй
  DateTime: RNFieldDateEdit,
  Boolean: RNFieldBooleanEdit,
  Link: RNFieldUrlEdit, // scaler
  File: RNFieldTextEdit, // түр дээ ашиглаагүй
  Image: RNFieldImageEdit, // scaler
  Object: RNFieldObjectEdit,
};

const DisplayFieldTypeMappings: {
  [fieldType: string]: {
    component: React.StatelessComponent<IRNFormFieldProps>;
    valuePreProcess?: (value: any) => any;
  };
} = {
  Text: { component: RNFieldTextDisplay },
  Note: { component: RNFieldTextDisplay },
  Lookup: { component: RNFieldLookupDisplay },
  LookupMulti: { component: RNFieldLookupDisplay },
  Choice: {
    component: RNFieldTextDisplay,
    valuePreProcess: (val) =>
      typeof val !== 'undefined' && val !== null
        ? t(val, { defaultValue: val })
        : val,
  },
  MultiChoice: {
    component: RNFieldTextDisplay,
    valuePreProcess: (val) =>
      val && val instanceof Array ? val.join(', ') : val,
  },
  Number: { component: RNFieldTextDisplay },
  Currency: { component: RNFieldTextDisplay },
  DateTime: {
    component: RNFieldTextDisplay,
    valuePreProcess: (val) =>
      moment(val).isValid() ? moment(val).format('YYYY/MM/DD HH:mm') : val,
  },
  Boolean: {
    component: RNFieldTextDisplay,
    valuePreProcess: (val) =>
      typeof val !== 'undefined' && val !== null ? t(String(val)) : val,
  },
  Link: { component: RNFieldUrlDisplay },
  Image: { component: RNFieldImageDisplay },
  File: { component: RNFieldTextDisplay },
  Object: { component: RNFieldObjectDisplay },
};

export interface IRNFormFieldProps extends IFormFieldProps {
  hideIfFieldUnsupported?: boolean;
  client: any;
  displaytype?: DisplayType;
  listname: string;
  id: number | string;
  key: number | string | undefined;
}

const RNFormField: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  let fieldControl: any = null;
  if (props.displaytype === DisplayType.Disabled) {
    props.disabled = true;
  }

  const fieldType = props.fieldSchema.FieldType;
  if (props.controlMode === ControlMode.Display) {
    if (DisplayFieldTypeMappings.hasOwnProperty(fieldType)) {
      const fieldMapping = DisplayFieldTypeMappings[fieldType];
      const childProps = fieldMapping.valuePreProcess
        ? { ...props, value: fieldMapping.valuePreProcess(props.value) }
        : props;
      fieldControl = React.createElement(fieldMapping.component, childProps);
    } else if (!props.hideIfFieldUnsupported) {
      const value = props.value
        ? typeof props.value === 'string'
          ? props.value
          : JSON.stringify(props.value)
        : '';
      fieldControl = (
        <>
          <Text>{value}</Text>
          <Label>
            <Icon
              name="close"
              style={{
                paddingRight: 5,
              }}
            />
            {`${t('UnsupportedFieldType')} "${fieldType}"`}
          </Label>
        </>
      );
    }
  } else {
    if (EditFieldTypeMappings.hasOwnProperty(fieldType)) {
      fieldControl = React.createElement(
        EditFieldTypeMappings[fieldType],
        props
      );
    } else if (!props.hideIfFieldUnsupported) {
      let isObjValue: boolean = props.value && typeof props.value !== 'string';
      const value = props.value
        ? typeof props.value === 'string'
          ? props.value
          : JSON.stringify(props.value)
        : '';
      fieldControl = (
        <>
          <Input
            disabled
            multiline={isObjValue}
            //errorMessage={`${t('UnsupportedFieldType')} "${fieldType}"`}
          >
            {value}
          </Input>
        </>
      );
    }
  }

  return fieldControl ? (
    <FormField
      key={props.key}
      hidden={
        props.displaytype === DisplayType.Hidden || props.fieldSchema.Hidden
      }
      {...props}
      label={props.label || props.fieldSchema.Title}
      description={props.description || props.fieldSchema.Description}
      required={
        props.fieldSchema.Required || props.displaytype === DisplayType.Requared
      }
      errorMessage={props.errorMessage}
    >
      {fieldControl}
    </FormField>
  ) : null;
};

export default RNFormField;
