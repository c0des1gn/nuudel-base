import React, { FC, useState, CSSProperties } from 'react';
import { View, Platform, Text, Keyboard, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Navigation } from 'react-native-navigation';
import { useStyles } from '../../theme/styles';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-elements';
import { t } from 'nuudel-utils';
import { OVERLAY_SCREEN } from '../../system_screens';

interface ILookupProps {
  title?: string;
  style?: CSSProperties | any;
  options: IPickerItem[];
  value?: any;
  onChange(value: any, index?: number);
  enabled?: boolean;
  prompt?: string;
}

interface IPickerItem {
  id: string | any;
  name: string;
}

const height = 250;
const Dropdown = ({ ...props }) => {
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  const [selectedValue, setSelectedValue] = useState(props.value);
  return (
    <Picker
      mode={Platform.OS === 'ios' ? 'dialog' : 'dropdown'}
      enabled={props?.enabled !== false}
      prompt={props?.prompt || t('SelectOne')}
      itemStyle={{
        fontSize: SIZES.H6,
        color: COLORS.TEXT,
        backgroundColor: COLORS.BACKGROUND_LIGHT,
      }}
      numberOfLines={1}
      dropdownIconRippleColor={COLORS.LOGIN}
      dropdownIconColor={COLORS.PRIMARY}
      style={{
        maxHeight: height,
        color: COLORS.TEXT,
        backgroundColor: COLORS.BACKGROUND_LIGHT,
      }}
      selectedValue={selectedValue}
      onValueChange={(val) => {
        setSelectedValue(val);
        if (props.onChange) {
          props.onChange(val);
        }
      }}
    >
      {!selectedValue && (
        <Picker.Item key={-1} label={t('SelectOne')} value={''} />
      )}
      {props.options.map((value, index: number) => (
        <Picker.Item key={index} label={value.name} value={value.id} />
      ))}
    </Picker>
  );
};

export const Lookup: FC<ILookupProps> = ({ style, ...props }) => {
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
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
    <View {...props} style={[{ margin: SIZES.PADDING_SMALL }, style]}>
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: 35,
            marginVertical: SIZES.PADDING,
            paddingHorizontal: SIZES.PADDING_HALF,
            alignSelf: 'stretch',
            borderColor: COLORS.BORDER_LIGHT,
            borderWidth: SIZES.BORDER_WIDTH,
            backgroundColor: COLORS.BACKGROUND_GREY,
            borderRadius: SIZES.BORDER_RADIUS,
          }}
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
                t('SelectOne')}
            </Text>
            <Icon
              onPress={showOverlay}
              name={'arrow-down'}
              size={SIZES.BIG}
              color={COLORS.PRIMARY}
            />
          </Pressable>
        </View>
      ) : (
        <Dropdown {...props} />
      )}
    </View>
  );
};

export default Lookup;
