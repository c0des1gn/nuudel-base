import React, { FC, useState } from 'react';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-elements';
import RnDatePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { dateToString } from 'nuudel-utils';
import { COLORS, SIZES } from '../../theme';

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
});

export interface IDatePickerProps {
  locale?: string;
  disabled?: boolean;
  defaultDate?: Date;
  placeHolderText?: string;
  placeHolderTextStyle?: any;
  onDateChange?(e?: any);
  style?: any;
  styleText?: any;
}

export const DatePicker: FC<IDatePickerProps> = ({
  style,
  styleText,
  ...props
}) => {
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [value, setValue] = useState(props?.defaultDate || new Date());
  const [mode, setMode] = useState(
    (Platform.OS === 'ios' ? 'datetime' : 'date') as any
  );

  const showDatepicker = () => {
    if (props.disabled !== true) {
      setShow(true);
    }
  };
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
        <Pressable
          onPress={showDatepicker}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={[styles.text, styleText]}>
            {dateToString(
              value,
              mode === 'datetime' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD'
            )}
          </Text>
          <Icon
            onPress={showDatepicker}
            name={'arrow-down'}
            size={SIZES.BIG}
            color={COLORS.PRIMARY}
          />
        </Pressable>
      )}
    </>
  );
};

export default DatePicker;
