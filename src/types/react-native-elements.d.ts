type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

declare module 'react-native-elements-n' {
  //export * from 'react-native-elements';

  export interface ISizes {
    FONTFAMILY: string;
    FONT: number;
    OPACITY: number;
    BORDER_RADIUS: number;
    BUTTON_BORDER_RADIUS: number;
    BORDER_WIDTH: number;
    PADDING: number;
    PADDING_HALF: number;
    PADDING_SMALL: number;
    MARGINGBOTTOM_SMALL: number;
    MARGINGBOTTOM: number;
    MARGINGBOTTOM_BIG: number;
    H1: number;
    H2: number;
    H3: number;
    H4: number;
    H5: number;
    H6: number;
    BIG: number;
    BODY: number;
    SMALL: number;
    ICON: number;
    ICON_NORMAL: number;
    ICON_MEDIUM: number;
    ICON_LARGE: number;
    ICON_HUGE: number;
    BUTTON_WIDTH: number;
    BUTTON_HEIGHT: number;
    BUTTON_SHADOW_RADIUS: number;
    BLOCK_SHADOW_OPACITY: number;
    BLOCK_SHADOW_RADIUS: number;
    ANDROID_ELEVATION: number;
    CARD_BORDER_RADIUS: number;
    CARD_BORDER_WIDTH: number;
    CARD_WIDTH: number;
    CARD_MARGIN_VERTICAL: number;
    CARD_FOOTER_HORIZONTAL: number;
    CARD_FOOTER_VERTICAL: number;
    CARD_AVATAR_WIDTH: number;
    CARD_AVATAR_HEIGHT: number;
    CARD_AVATAR_RADIUS: number;
    CARD_IMAGE_HEIGHT: number;
    CARD_ROUND: number;
    CARD_ROUNDED: number;
    INPUT_BORDER_RADIUS: number;
    INPUT_BORDER_WIDTH: number;
    INPUT_HEIGHT: number;
    INPUT_HORIZONTAL: number;
    INPUT_VERTICAL_TEXT: number;
    INPUT_VERTICAL_LABEL: number;
    INPUT_TEXT: number;
    INPUT_ROUNDED: number;
    CHECKBOX_WIDTH: number;
    CHECKBOX_HEIGHT: number;
    TRACK_SIZE: number;
    THUMB_SIZE: number;
    RADIO_WIDTH: number;
    RADIO_HEIGHT: number;
    RADIO_THICKNESS: number;
  }

  export interface IColors {
    TRANSPARENT: string;
    NEUTRAL: string;
    FACEBOOK: string;
    LOGIN: string;
    PRIMARY: string;
    PRIMARY_LIGHT: string;
    INFO: string;
    DANGER: string;
    WARNING: string;
    SUCCESS: string;
    BUTTON: string;
    LINK: string;
    TEXT: string;
    TEXT_DARK: string;
    TEXT_LIGHT: string;
    BACKGROUND: string;
    BACKGROUND_LIGHT: string;
    BACKGROUND_DARK: string;
    BACKGROUND_GREY: string;
    BORDER: string;
    BORDER_LIGHT: string;
    INPUT: string;
    PLACEHOLDER: string;
    NAVBAR: string;
    BLOCK: string;
    ICON: string;
    ICON_LIGHT: string;
    SHADOW: string;
    DISABLED: string;
    INVERSE_BG: string;
    INVERSE_TEXT: string;
    LOADER: string;
  }

  export interface FullTheme {
    COLORS: RecursivePartial<IColors>;
    SIZES: Partial<ISizes>;
  }
}
