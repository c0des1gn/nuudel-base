import React, { useRef, useState } from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import Sign, { SignatureViewRef } from 'react-native-signature-canvas';
import Button from '../Button';
import Text from '../Text';
import Pressable from '../Pressable';
import { t } from 'nuudel-utils';
import { SvgXml } from 'react-native-svg';
import * as crypto from 'crypto-js';
import { COLORS, SIZES } from '../../theme';

interface Props {
  title?: string;
  text?: string;
  onOK?: (signature: string, rating: number) => void;
  onClear?: () => void;
  mimeType?: 'image/png' | 'image/jpeg' | 'image/svg+xml';
}

const { width } = Dimensions.get('window');
const calcHeight = Platform.OS === 'ios' ? width - 25 : width;
const height = width - 100;
const columnWidth = Math.ceil(width / 3) - 15;

const styles = StyleSheet.create({
  preview: {
    width: width,
    height: height,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  text: {
    fontSize: SIZES.H6,
    paddingTop: SIZES.PADDING_HALF,
    paddingHorizontal: SIZES.PADDING_HALF,
  },
});

const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${width}px; height: ${width}px;}`;

const webStyle = `.m-signature-pad--footer
    .save {
        display: none;
    }
    .description {
      display: none;
    }
    .clear {
        display: none;
    }
`;

const Signature: React.FC<Props> = ({
  title = t('Attach signature'),
  text = t('sign above'),
  mimeType = 'image/svg+xml',
  onOK,
  onClear,
}) => {
  const ref = useRef<SignatureViewRef>(null);
  const [sign, setSign] = useState('');
  const [rating, setRating] = useState(1);

  const handleSignature = (signature: any) => {
    let signed: string = signature;
    if (
      mimeType === 'image/svg+xml' &&
      typeof signature === 'string' &&
      signature.length > 26
    ) {
      // base64 decode
      signed = crypto.enc.Base64.parse(signature.substring(26)).toString(
        crypto.enc.Utf8
      );
    }
    setSign(signed);
    if (onOK) {
      onOK(signature, rating);
    }
  };

  const clear = () => {
    ref.current?.clearSignature();
    if (onClear) {
      onClear();
    }
  };

  const handleReset = () => {
    setSign('');
    clear();
    Keyboard.dismiss();
  };

  const handleClear = () => {
    clear();
  };

  const handleConfirm = (rate: number) => {
    setRating(rate);
    ref.current?.readSignature();
  };

  return (
    <View>
      {!sign ? (
        <Text style={styles.text}>{title}</Text>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            styleText={{
              color: COLORS.PRIMARY,
              fontSize: SIZES.H6,
              paddingVertical: SIZES.PADDING_SMALL,
              paddingHorizontal: SIZES.PADDING_HALF,
            }}
            onPress={handleReset}
          >
            {t('Re-take Signature')}
          </Pressable>
        </View>
      )}
      {!sign ? (
        <View
          style={{
            width: width,
            height: calcHeight,
          }}
        >
          <Sign
            ref={ref}
            onOK={handleSignature}
            onEmpty={handleReset}
            androidHardwareAccelerationDisabled={false}
            imageType={mimeType}
            bgWidth={width}
            bgHeight={calcHeight}
            clearText={t('Clear')}
            confirmText={t('Confirm')}
            trimWhitespace={false}
            autoClear={false}
            descriptionText={text}
            webStyle={webStyle}
          />
          <Text
            style={{
              position: 'absolute',
              opacity: 1,
              zIndex: 1,
              elevation: 1,
              top: 15,
              right: 10,
              fontSize: 20,
              color: '#444',
              paddingHorizontal: 5,
            }}
            onPress={handleClear}
          >
            X
          </Text>
          <View
            style={{
              paddingTop: SIZES.PADDING_HALF,
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <Button
              containerStyle={{ minWidth: columnWidth, marginLeft: 10 }}
              onPress={() => handleConfirm(1)}
            >
              :-(
            </Button>
            <Button
              containerStyle={{ minWidth: columnWidth, marginLeft: 10 }}
              onPress={() => handleConfirm(3)}
            >
              :-|
            </Button>
            <Button
              containerStyle={{ minWidth: columnWidth, marginLeft: 10 }}
              onPress={() => handleConfirm(5)}
            >
              :-)
            </Button>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.preview}>
            {mimeType === 'image/svg+xml' ? (
              <SvgXml xml={sign} width={width} height={height} />
            ) : (
              <Image
                resizeMode={'contain'}
                style={{ width: width, height: height }}
                source={{ uri: sign }}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default Signature;
