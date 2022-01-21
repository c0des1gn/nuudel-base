import COLORS from './colors';
import SIZES from './sizes';

const changeTheme = (COLORS, SIZES) => {
  theme = {
    COLORS,
    SIZES,
    Button: {
      //raised: false,
      containerStyle: {
        marginBottom: 0,
      },
    },
    colors: {
      primary: COLORS.PRIMARY,
      secondary: COLORS.PRIMARY_LIGHT,
      success: COLORS.SUCCESS,
      error: COLORS.DANGER,
      warning: COLORS.WARNING,
      divider: COLORS.BORDER_LIGHT,
      background: COLORS.BACKGROUND,
      border: COLORS.BORDER_LIGHT,
      text: COLORS.TEXT,
      danger: COLORS.DANGER,
    },
  };
};
let theme: any = changeTheme(COLORS, SIZES);

export { theme, changeTheme };
