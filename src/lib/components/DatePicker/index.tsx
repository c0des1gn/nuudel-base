import React, { FC, useState, useEffect } from 'react';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
import { Text } from 'react-native-elements';
import RnDatePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { dateToString, toDate } from 'nuudel-utils';
import { COLORS, SIZES } from '../../theme';
import { t } from 'nuudel-utils';

const styles = StyleSheet.create({
  date: {
    fontSize: SIZES.H6,
    color: COLORS.TEXT,
    backgroundColor: COLORS.BACKGROUND,
    zIndex: 999,
    elevation: 999,
  },
  text: {
    lineHeight: 35,
    marginRight: 'auto',
    paddingLeft: SIZES.PADDING_HALF,
    color: COLORS.TEXT,
    fontSize: SIZES.BIG,
  },
  box: {
    height: 35,
    marginVertical: SIZES.PADDING,
    paddingHorizontal: SIZES.PADDING_HALF,
    alignSelf: 'stretch',
    borderColor: COLORS.BORDER_LIGHT,
    borderWidth: SIZES.BORDER_WIDTH,
    backgroundColor: COLORS.BACKGROUND_GREY,
    borderRadius: SIZES.BORDER_RADIUS,
  },
  press: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export interface IDatePickerProps {
  locale?: string; // en-US
  disabled?: boolean;
  defaultDate?: Date;
  placeHolderText?: string;
  placeHolderTextStyle?: any;
  onDateChange?(e?: any);
  style?: any;
  styleText?: any;
  textColor?: string;
}

export const DatePicker: FC<IDatePickerProps> = ({
  style,
  styleText,
  ...props
}) => {
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [value, setValue] = useState(toDate(props?.defaultDate));
  const [mode, setMode] = useState(
    (Platform.OS === 'ios' ? 'datetime' : 'date') as any
  );

  const showDatepicker = () => {
    if (props?.disabled !== true) {
      setShow(true);
    }
  };

  /*
  useEffect(() => {
    if (value === new Date('1970-01-01T12:00:00')) {
      setValue(props.defaultDate);
    }
  }, [props.defaultDate]); // */

  return (
    <>
      {show ? (
        <RnDatePicker
          {...props}
          testID="dateTimePicker"
          display={Platform.OS === 'ios' ? 'compact' : 'default'}
          value={value}
          mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
          onChange={(e: any, date?: Date) => {
            if (date) {
              date = new Date();
            }
            setShow(Platform.OS === 'ios');
            setValue(date);
            if (props?.onDateChange) {
              props.onDateChange(date);
            }
          }}
          disabled={props.disabled}
          style={[styles.date, style]}
        />
      ) : (
        <View style={styles.box}>
          <Pressable onPress={showDatepicker} style={styles.press}>
            <Text style={[styles.text, styleText]}>
              {dateToString(
                value,
                mode === 'datetime' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD'
              ) ||
                props?.placeHolderText ||
                t('Select Date')}
            </Text>
            <Icon
              onPress={showDatepicker}
              name={'arrow-down'}
              size={SIZES.BIG}
              color={COLORS.PRIMARY}
            />
          </Pressable>
        </View>
      )}
    </>
  );
};

export default DatePicker;
