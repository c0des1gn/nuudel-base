import React from 'react';
import moment from 'moment';
import { COLORS, SIZES } from '../../theme';
import { IRNFormFieldProps } from './RNFormField';
import { ControlMode } from 'nuudel-utils';
import { DatePicker } from '../../components';
import { t } from 'nuudel-utils';
import { mapDispatchToProps, mapStateToProps, storeProps } from './RNFieldCore';
import { getValue, changeProp } from '../../redux/actions/fields';
import { connect } from 'react-redux';
//import * as RNLocalize from 'react-native-localize';

export const getLocale = (attr: string = 'languageTag'): string => {
  /*
  const locales = RNLocalize.getLocales();
  if (locales) {
    if (Array.isArray(locales)) {
      return locales[0][attr];
    }
  }// */
  return 'en-US';
};

const RNFieldDateEdit: React.FunctionComponent<IRNFormFieldProps> = (props) => {
  const locale = getLocale();
  const { disabled } = storeProps(props);
  let value = props.value ? props.value : null;
  if (props.controlMode === ControlMode.New) {
    value = new Date();
  }

  return value !== null ? (
    <DatePicker
      disabled={props.disabled || disabled}
      {...(value && moment(value).isValid()
        ? { defaultDate: moment(value).toDate() }
        : {})}
      placeHolderText={!value ? t('DateFormFieldPlaceholder') : undefined}
      //isRequired={props.fieldSchema.Required}
      //ariaLabel={props.fieldSchema.Title}
      locale={getLocale('languageCode')}
      //firstDayOfWeek={props.fieldSchema.FirstDayOfWeek}
      placeHolderTextStyle={{
        color: COLORS.PLACEHOLDER,
        backgroundColor: COLORS.BACKGROUND,
      }}
      onDateChange={(date) =>
        props.valueChanged(
          moment(date).isValid()
            ? moment(date).format('YYYY-MM-DD HH:mm:ss')
            : date
        )
      }
    />
  ) : null;
};

export default connect(mapStateToProps, mapDispatchToProps)(RNFieldDateEdit);
