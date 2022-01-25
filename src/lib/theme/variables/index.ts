import { COLORS } from './colors';

let theme: any = {
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

const changeTheme = (_theme: any) => {
  theme = _theme;
};

export { theme, changeTheme };
