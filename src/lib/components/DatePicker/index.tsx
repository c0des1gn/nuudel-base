import React, { FC, useState } from 'react';
import { Platform } from 'react-native';
import { makeStyles, Text } from 'react-native-elements';
import RnDatePicker from '@react-native-community/datetimepicker';
import { dateToString } from 'nuudel-utils';

const getStyle: Function = (COLORS, SIZES): any => {
  return {
    date: {
      fontSize: SIZES.H6,
      color: COLORS.TEXT,
      backgroundColor: COLORS.BACKGROUND,
      zIndex: 999,
      elevation: 999,
    },
    text: { color: COLORS.LINK, lineHeight: 35, marginLeft: 8 },
  };
};

const useStyles = makeStyles((theme, props?: any) => {
  const { COLORS, SIZES } = theme as any;
  return getStyle(COLORS, SIZES);
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
  const styles = useStyles(props);
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [value, setValue] = useState(props.defaultDate || new Date());
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
            setShow(Platform.OS === 'ios');
            setValue(date || new Date());
            if (props?.onDateChange) {
              props.onDateChange(date);
            }
          }}
          disabled={props.disabled}
          style={[styles.date, style]}
        />
      ) : (
        <Text style={[styles.text, styleText]} onPress={showDatepicker}>
          {dateToString(
            value,
            mode === 'datetime' ? 'YYYY/MM/DD HH:mm' : 'YYYY/MM/DD'
          )}
        </Text>
      )}
    </>
  );
};

export default DatePicker;
