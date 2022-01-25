import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../theme';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  textName: {
    fontSize: SIZES.H6,
    marginLeft: SIZES.PADDING_SMALL,
  },
  contentContainer: {
    paddingBottom: 20,
    backgroundColor: COLORS.BACKGROUND,
  },
  collapseIcon: {
    width: 0,
    height: 0,
    marginRight: 2,
    borderStyle: 'solid',
  },
  emptyWishContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: (height + width) / 2,
  },
  box: {
    alignContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.H4,
    fontWeight: '400',
    marginTop: 25,
    color: COLORS.TEXT_LIGHT,
  },
  desc: {
    marginTop: SIZES.PADDING,
    flexWrap: 'wrap',
    textAlign: 'center',
    fontSize: SIZES.BODY,
    maxWidth: 250,
    lineHeight: SIZES.H5,
    color: COLORS.PLACEHOLDER,
  },
});

export { styles };

export default styles;
