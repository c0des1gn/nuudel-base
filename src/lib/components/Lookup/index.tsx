import React, { FC, useState, CSSProperties } from 'react';
import { View, Platform, Text, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Navigation } from 'react-native-navigation';
import { styles } from '../../theme/styles';
import { Picker } from '@react-native-picker/picker';
import { t } from '../../loc/i18n';
import { OVERLAY_SCREEN } from '../../system_screens';
import { COLORS, SIZES } from '../../theme';

interface ILookupProps {
  title?: string;
  style?: CSSProperties | any;
  containerStyle?: CSSProperties | any;
  iosStyle?: CSSProperties | any;
  iosDropdownIcon?: any;
  itemStyle?: CSSProperties | any;
  options: IPickerItem[];
  value?: any;
  onChange(value: any, index?: number);
  enabled?: boolean;
  prompt?: string;
  noneText?: string;
}

interface IPickerItem {
  id: any;
  name: string;
  icon?: any;
}

const height = 250;

export const Dropdown: FC<ILookupProps> = ({ ...props }) => {
  const [selectedValue, setSelectedValue] = useState(props.value);
  return (
    <Picker
      mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
      enabled={props?.enabled !== false}
      prompt={props?.prompt || t('SelectOne')}
      itemStyle={[
        {
          fontSize: SIZES.H6,
          color: COLORS.TEXT,
          backgroundColor: COLORS.BACKGROUND_LIGHT,
        },
        props.itemStyle,
      ]}
      numberOfLines={1}
      dropdownIconRippleColor={COLORS.LOGIN}
      dropdownIconColor={COLORS.PRIMARY}
      style={[
        {
          maxHeight: height,
          color: COLORS.TEXT,
          backgroundColor: COLORS.BACKGROUND_LIGHT,
        },
        props.style,
      ]}
      selectedValue={selectedValue}
      onValueChange={(itemValue: any, itemIndex: number) => {
        if (null === itemValue || 'undefined' === typeof itemValue) {
          return;
        }
        setSelectedValue(itemValue);
        if (props.onChange) {
          props.onChange(itemValue);
        }
      }}
    >
      {!selectedValue && !!props.noneText && (
        <Picker.Item
          key={-1}
          label={props.noneText || t('SelectOne')}
          value={''}
        />
      )}
      {props.options.map((value: IPickerItem, index: number) => (
        <Picker.Item key={index} label={value.name} value={value.id}>
          {value?.icon}
        </Picker.Item>
      ))}
    </Picker>
  );
};

export const Lookup: FC<ILookupProps> = ({
  iosDropdownIcon,
  iosStyle,
  ...props
}) => {
  const showOverlay = () => {
    Keyboard.dismiss();
    Navigation.showOverlay({
      component: {
        id: OVERLAY_SCREEN.id,
        name: OVERLAY_SCREEN.name,
        passProps: {
          Component: Dropdown,
          context: props,
          title: props.title,
          height: height,
          showButton: true,
        },
        options: {
          layout: {
            componentBackgroundColor: 'transparent',
          },
          overlay: {
            interceptTouchOutside: true,
          },
        },
      },
    });
  };

  return (
    <View style={[{ margin: SIZES.PADDING_SMALL }, props.containerStyle]}>
      {Platform.OS === 'ios' ? (
        <View
          style={[
            {
              height: 35,
              marginVertical: SIZES.PADDING,
              paddingHorizontal: SIZES.PADDING_HALF,
              alignSelf: 'stretch',
              borderColor: COLORS.BORDER_LIGHT,
              borderWidth: SIZES.BORDER_WIDTH,
              backgroundColor: COLORS.BACKGROUND_GREY,
              borderRadius: SIZES.BORDER_RADIUS,
            },
            iosStyle,
          ]}
        >
          <Pressable
            onPress={showOverlay}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                lineHeight: 35,
                marginRight: 'auto',
                paddingLeft: SIZES.PADDING_HALF,
                color: !props.value ? COLORS.PLACEHOLDER : COLORS.TEXT,
                fontSize: SIZES.BIG,
              }}
            >
              {props.options.filter((o) => o.id === props.value)[0]?.name ||
                props?.prompt ||
                t('SelectOne')}
            </Text>
            {!iosDropdownIcon ? (
              <Icon
                onPress={showOverlay}
                name={'arrow-down'}
                size={SIZES.BIG}
                color={COLORS.PRIMARY}
              />
            ) : (
              iosDropdownIcon
            )}
          </Pressable>
        </View>
      ) : (
        <Dropdown {...props} />
      )}
    </View>
  );
};

export default Lookup;
