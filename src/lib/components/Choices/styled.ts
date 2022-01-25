import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 0,
    borderBottomWidth: SIZES.BORDER_WIDTH,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  body: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    flex: 1,
  },
  BodyRight: { flexDirection: 'column', alignItems: 'flex-end' },
  text: {
    fontSize: SIZES.BIG,
    fontFamily: SIZES.FONTFAMILY,
    color: COLORS.TEXT_DARK,
  },
  checkBox: {
    left: 0,
    marginBottom: SIZES.PADDING_HALF,
    marginTop: SIZES.PADDING_HALF,
    marginRight: SIZES.PADDING_SMALL,
  },
  radioForm: {},

  radioWrap: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  radio: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 30,
    height: 30,

    alignSelf: 'center',

    borderColor: COLORS.BORDER,
    borderRadius: 30,
  },

  icon: { paddingRight: SIZES.PADDING * 1.5 },

  radioLabel: {
    paddingLeft: SIZES.PADDING_HALF,
    fontSize: SIZES.H6,
    lineHeight: 20,
  },

  radioNormal: {
    borderRadius: 10,
  },

  radioActive: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.PRIMARY,
  },

  labelWrapStyle: {
    paddingRight: SIZES.PADDING_SMALL,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },

  labelVerticalWrap: {
    flexDirection: 'column',
    paddingLeft: 10,
  },

  labelVertical: {
    paddingLeft: 0,
  },

  formHorizontal: {
    flexDirection: 'row',
  },
  radioFrom: {},
  pickContainer: {
    flex: 1,
    minHeight: 36,
  },
  pick: {
    padding: 3,
    flex: 1,
    flexDirection: 'row',
    height: 36,
  },
  pickitem: {
    height: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.BACKGROUND_GREY,
    borderRadius: 20,
    borderWidth: 0,
  },
  picktext: {
    color: COLORS.TEXT,
    lineHeight: 20,
    fontSize: SIZES.H6,
    height: 20,
  },
  selectedItem: {
    //backgroundColor: COLORS.BACKGROUND_DARK,
    opacity: 0.95,
  },
  image: {
    width: 36,
    height: 36,
    marginLeft: 15,
    marginTop: -8,
  },
  box: { flexDirection: 'row' },
});

export { styles };

export default styles;
