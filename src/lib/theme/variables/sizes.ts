import { PixelRatio, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const BASE = 12;

export var SIZES: any = {
  FONTFAMILY:
    Platform.OS === 'ios' || Platform.OS === 'macos'
      ? 'Helvetica'
      : Platform.OS === 'android'
      ? 'Roboto'
      : 'Arial', //'Open Sans'
  //BASE: BASE,
  FONT: BASE,
  OPACITY: 0.6,
  BORDER_RADIUS: 4,
  BUTTON_BORDER_RADIUS: 999,
  BORDER_WIDTH: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  PADDING: 15,
  PADDING_HALF: 8,
  PADDING_SMALL: 5,
  MARGINGBOTTOM_SMALL: 5,
  MARGINGBOTTOM: 10,
  MARGINGBOTTOM_BIG: 25,

  // Typography
  H1: BASE * 2.5, // ~30
  H2: BASE * 2.25, // ~27
  H3: BASE * 2, // ~24
  H4: BASE * 1.75, // ~21
  H5: BASE * 1.5, // ~18
  H6: BASE * 1.25, // ~15
  BIG: BASE + 2, // ~14
  BODY: BASE + 1, // ~13
  SMALL: BASE * 0.85, // ~10

  // Icons
  ICON: BASE,
  ICON_NORMAL: BASE * 1.25,
  ICON_MEDIUM: BASE * 1.5,
  ICON_LARGE: BASE * 1.75,
  ICON_HUGE: BASE * 3.5,

  // Button styles
  BUTTON_WIDTH: BASE * 9,
  BUTTON_HEIGHT: BASE * 2.75,
  BUTTON_SHADOW_RADIUS: 3,

  // Block styles
  BLOCK_SHADOW_OPACITY: 0.15,
  BLOCK_SHADOW_RADIUS: 8,
  ANDROID_ELEVATION: 1,

  // Card styles
  CARD_BORDER_RADIUS: BASE * 0.4,
  CARD_BORDER_WIDTH: BASE * 0.05,
  CARD_WIDTH: width - BASE * 2,
  CARD_MARGIN_VERTICAL: BASE * 0.875,
  CARD_FOOTER_HORIZONTAL: BASE * 0.75,
  CARD_FOOTER_VERTICAL: BASE * 0.75,
  CARD_AVATAR_WIDTH: BASE * 2.5,
  CARD_AVATAR_HEIGHT: BASE * 2.5,
  CARD_AVATAR_RADIUS: BASE * 1.25,
  CARD_IMAGE_HEIGHT: BASE * 12.5,
  CARD_ROUND: BASE * 0.1875,
  CARD_ROUNDED: BASE * 0.5,

  // Input styles
  INPUT_BORDER_RADIUS: BASE * 0.5,
  INPUT_BORDER_WIDTH: BASE * 0.05,
  INPUT_HEIGHT: BASE * 2.75,
  INPUT_HORIZONTAL: BASE,
  INPUT_VERTICAL_TEXT: 14,
  INPUT_VERTICAL_LABEL: BASE / 2,
  INPUT_TEXT: BASE * 0.875,
  INPUT_ROUNDED: BASE * 1.5,

  // Checkbox
  CHECKBOX_WIDTH: 20,
  CHECKBOX_HEIGHT: 20,

  // Slider
  TRACK_SIZE: 4,
  THUMB_SIZE: 25,

  // Radio Button
  RADIO_WIDTH: 24,
  RADIO_HEIGHT: 24,
  RADIO_THICKNESS: 2,
};

export const setSizes = (Sizes: any = {}) => {
  SIZES = { ...SIZES, ...Sizes };
  return SIZES;
};
