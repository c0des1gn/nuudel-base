import { StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES } from '../../theme';

const styles = StyleSheet.create({
  searchBar: {},
  containerButton: {
    //width: '100%',
    marginBottom: SIZES.MARGINGBOTTOM,
  },
  Button: {
    borderRadius: SIZES.BUTTON_BORDER_RADIUS,
    //backgroundColor: COLORS.BUTTON,
    fontFamily: SIZES.FONTFAMILY,
    overflow: 'hidden',
  },
  ButtonText: {
    flex: Platform.OS === 'android' ? 1 : undefined,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.BACKGROUND,
    fontSize: SIZES.H6,
  },
  Item: {
    marginBottom: 0,
    marginLeft: 0,
  },
  Text: {
    fontFamily: SIZES.FONTFAMILY,
    fontSize: SIZES.FONT,
  },
  H1: {
    fontFamily: SIZES.FONTFAMILY,
    fontSize: SIZES.H1,
    marginBottom: 15,
  },
  Label: {
    fontFamily: SIZES.FONTFAMILY,
  },
  Container: {
    flex: 1,
    backgroundColor: COLORS.TRANSPARENT,
  },
  Padding: {
    padding: SIZES.PADDING_HALF,
  },
  Bg: {
    backgroundColor: COLORS.BACKGROUND,
  },
  Form: {
    width: '100%',
  },
  Input: {
    fontFamily: SIZES.FONTFAMILY,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 4,
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    height: 150,
    width: 150,
    borderColor: COLORS.BORDER,
  },
  Slider: { width: '100%', height: 21 },
  font: { fontFamily: SIZES.FONTFAMILY, fontSize: SIZES.FONT },
  text: { fontSize: SIZES.H6, padding: 0, height: 36, color: COLORS.TEXT },
  button: {
    minWidth: 150,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    height: 40,
  },
  image: { maxWidth: '100%', flex: 1, width: '100%', height: '100%' },
  picture: { flexDirection: 'row-reverse' },
});

export { styles };

export default styles;
