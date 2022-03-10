import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Image, View, Dimensions } from 'react-native';
import { Text } from '../../components';
import { styles } from './styled';
import { t } from '../../loc/i18n';

const { width } = Dimensions.get('window');

const RNFieldImageDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  if (!!props.value && props.value instanceof Array) {
    if (props.value.length > 0) {
      return (
        <>
          {props.value.map((v, index: number) => (
            <Image
              key={index}
              source={v}
              style={{
                maxWidth: '100%',
                alignSelf: 'flex-end',
              }}
              resizeMode="contain"
              resizeMethod="auto"
            />
          ))}
        </>
      );
    } else return <></>;
  } else {
    if (props.value && props.value.uri) {
      let _width: any = '100%';
      //Image.getSize(props.value, success, [failure]);
      let height: any = width * 0.7;

      if (props.value.height && props.value.width) {
        height = (height * props.value.height) / props.value.width;
      }

      if (props.fieldSchema && props.fieldSchema.InternalName === 'avatar') {
        _width = height = 50;
      }

      // picture field
      return (
        <Image
          source={props.value}
          style={{
            maxWidth: '100%',
            alignSelf: 'flex-end',
            width: _width,
            height,
          }}
          resizeMode="contain"
          resizeMethod="auto"
        />
      );
    } else {
      return (
        <Text style={styles.display}>{t('ImageFieldPlaceholder')}</Text>
        /*<Image
          source={require('../../static/images/placeholder.png')}
          style={{maxWidth: '100%', width: '100%', height: '100%'}}
          resizeMode="contain"
          resizeMethod="auto"
        /> */
      );
    }
  }
};

export default RNFieldImageDisplay;
