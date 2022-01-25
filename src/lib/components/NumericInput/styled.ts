/**
 * Input Spinner - Style
 * @author Damii
 */

import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../theme';

const styles = StyleSheet.create({
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
});

export { styles };

export default styles;
