/**
 * Input Spinner - Style
 * @author Damii
 */

import { StyleSheet } from 'react-native';
import { makeStyles } from 'react-native-elements';

const styles: Function = (COLORS, SIZES) => {
  return {
    container: {
      flexDirection: 'row',
      overflow: 'hidden',
      alignItems: 'center',
      width: 175,
    },
    buttonLeft: {
      borderWidth: 1.5,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
    },
    buttonRight: {
      borderWidth: 1.5,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 2,
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
    },
    buttonRounded: {
      borderWidth: 1.5,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      borderRadius: 999,
    },
    buttonText: {
      color: COLORS.BACKGROUND,
      textAlign: 'center',
    },
    numberText: {
      flex: 1,
      fontWeight: '500',
      textAlign: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      paddingTop: 0,
      paddingBottom: 0,
    },
  };
};

const useStyles = makeStyles((theme, props?: any) => {
  const { COLORS, SIZES } = theme as any;
  return styles(COLORS, SIZES);
});

export { useStyles, styles as getStyle };

export default useStyles;
