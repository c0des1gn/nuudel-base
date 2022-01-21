import { StyleSheet, Platform } from 'react-native';
import { makeStyles } from 'react-native-elements';

const styles: Function = (COLORS, SIZES) => {
  return {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.BACKGROUND_LIGHT,
    },
    multiSelectContainer: {
      height: 250,
      width: '100%',
      zIndex: 999,
      elevation: 999,
    },
    display: {
      paddingVertical: SIZES.PADDING_SMALL,
      fontSize: SIZES.BODY,
      color: COLORS.TEXT,
      lineHeight: SIZES.H3,
      textAlign: 'justify',
    },
    text: { fontSize: SIZES.H6, padding: 0, height: 36, color: COLORS.TEXT },
    number: { fontSize: SIZES.H6, color: COLORS.TEXT },
    url: { fontSize: SIZES.H6, color: COLORS.TEXT },
    object: { fontSize: SIZES.H6, color: COLORS.TEXT },
    lookup: {
      width: '100%',
      color: COLORS.TEXT,
    },
    lookupText: {
      fontSize: SIZES.H6,
      color: COLORS.TEXT,
      backgroundColor: COLORS.TRANSPARENT,
    },
    pickerView: {
      paddingRight: Platform.OS === 'android' ? 0 : SIZES.PADDING_HALF,
      backgroundColor:
        Platform.OS === 'android'
          ? COLORS.BACKGROUND_GREY
          : COLORS.BACKGROUND_LIGHT,
    },
    lookupPlaceholder: { color: COLORS.PLACEHOLDER },
    image: { maxWidth: '100%', flex: 1, width: '100%', height: '100%' },
    picture: { flexDirection: 'row-reverse' },
    containerButton: {
      marginVertical: SIZES.PADDING_SMALL,
    },
    button: {
      minWidth: 150,
      flexDirection: 'row',
      alignSelf: 'flex-end',
      height: 40,
    },
    date: {
      fontSize: SIZES.H6,
      color: COLORS.TEXT,
      backgroundColor: COLORS.BACKGROUND,
      zIndex: 999,
      elevation: 999,
    },
    choice: {
      width: '100%',
      color: COLORS.TEXT,
    },
    multichoice: { fontSize: SIZES.H6 },
    select: { fontSize: SIZES.H6 },
    textarea: {
      fontSize: SIZES.H6,
      borderBottomWidth: 0,
      width: '100%',
    },
    bool: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'flex-end',
    },
    toggle: {
      flex: 1,
      top: Platform.OS === 'ios' ? 9 : 0,
      marginTop: 0,
      marginBottom: 0,
      height: 50,
      alignSelf: 'flex-end',
      alignContent: 'flex-end',
    },
  };
};

const useStyles = makeStyles((theme, props?: any) => {
  const { COLORS, SIZES } = theme as any;
  return styles(COLORS, SIZES);
});

export { useStyles, styles as getStyle };

export default useStyles;
