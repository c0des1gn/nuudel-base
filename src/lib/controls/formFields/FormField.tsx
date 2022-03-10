import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Text, Label, Item } from '../../components';
import { ControlMode } from 'nuudel-utils';
import { IFieldSchema } from '../../services/datatypes/RenderListData';
import { DelayedRender } from '../../common/DelayedRender';
import { COLORS, SIZES } from '../../theme';
import { t } from '../../loc/i18n';

export interface IFormFieldProps {
  className?: string;
  controlMode: ControlMode;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  active?: boolean;
  value: any;
  fieldSchema: IFieldSchema;
  errorMessage?: string;
  valueChanged(newValue: any): void;
}

const FormField: React.FunctionComponent<IFormFieldProps> = (props) => {
  const {
    children,
    disabled,
    description,
    required,
    active,
    errorMessage,
    fieldSchema,
    controlMode,
    hidden,
  } = props;

  let label = props.label;
  const isDescriptionAvailable: boolean = Boolean(description || errorMessage);

  return hidden ? null : (
    <Item
      //underline
      error={!!errorMessage}
      style={{
        borderBottomColor: COLORS.BORDER_LIGHT,
        borderBottomWidth: SIZES.BORDER_WIDTH,
        marginBottom: 0,
        flexDirection: 'column',
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        {!!label && (
          <Label
            style={{
              minWidth: '30%',
              minHeight: 36,
              paddingLeft: SIZES.PADDING,
              textTransform: 'capitalize',
              paddingVertical: SIZES.PADDING_SMALL,
              fontSize: SIZES.H6,
              lineHeight: SIZES.H3,
            }}
          >
            {label}:{required && <Text style={{ color: COLORS.INFO }}> *</Text>}
          </Label>
        )}
        <View
          style={
            props.controlMode === ControlMode.Display
              ? {
                  flex: 1,
                  paddingRight: SIZES.PADDING,
                  alignSelf: 'flex-start',
                  alignItems: 'flex-end',
                }
              : { flex: 1, paddingRight: SIZES.PADDING }
          }
        >
          {children}
        </View>
      </View>
      {isDescriptionAvailable && (
        <View
          style={{
            width: '100%',
            marginTop: -SIZES.PADDING_SMALL,
            paddingHorizontal: SIZES.PADDING,
            paddingBottom: SIZES.PADDING_SMALL,
          }}
        >
          {!!errorMessage && (
            <DelayedRender>
              <Text>
                <Icon
                  name="close"
                  style={{
                    fontSize: SIZES.FONT,
                    color: COLORS.DANGER,
                    marginRight: SIZES.PADDING_SMALL,
                  }}
                />
                {errorMessage}
              </Text>
            </DelayedRender>
          )}
          {props.controlMode !== ControlMode.Display && !!description && (
            <Text
              style={{
                fontStyle: 'italic',
                color: COLORS.PLACEHOLDER,
                fontSize: SIZES.FONT,
                flexWrap: 'wrap',
              }}
            >
              {description}
            </Text>
          )}
        </View>
      )}
    </Item>
  );
};

export default FormField;
