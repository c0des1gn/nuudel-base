import React, { Component } from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
  KeyboardTypeOptions,
} from 'react-native';
import { styles } from './styled';
import { COLORS, SIZES } from '../../theme';

/**
 * Default Color
 * @type {string}
 */
const defaultColor = COLORS.TEXT;

export interface INumericInputProps {
  children?: any;
  type: string;
  min: string | number;
  max: string | number;
  value: string | number;
  step: string | number;
  precision: number;
  rounded: boolean;
  activeOpacity: number;
  color: string;
  colorPress: string;
  colorButton: string;
  backgroundButton: string;
  colorMax?: string;
  colorMin?: string;
  background: string;
  textColor: string;
  arrows: boolean;
  showBorder: boolean;
  fontSize: number;
  fontFamily: string;
  buttonFontSize: number;
  buttonFontFamily: string;
  buttonTextColor: string;
  buttonPressTextColor: string;
  disabled: boolean;
  editable: boolean;
  width: string | number;
  height: string | number;
  onChange?(num: number): void;
  onMin?(num: number): void;
  onMax?(num: number): void;
  onIncrease?(num: number): void;
  onDecrease?(num: number): void;
  buttonLeftDisabled: boolean;
  buttonRightDisabled: boolean;
  buttonLeftText: string;
  buttonRightText: string;
  buttonLeftImage?: any;
  buttonRightImage?: any;
  buttonPressLeftImage?: any;
  buttonPressRightImage?: any;
  buttonStyle: object;
  buttonPressStyle: object;
  inputStyle: object;
  style: object;
  append?: any;
  prepend?: any;
  showButtons: boolean;
  focusShowButtons: boolean;
  delay: number;
}

export interface INumericInputStates {
  min: number;
  max: number;
  value: number;
  step: any;
  buttonPress: any;
  showButtons: boolean;
}

/**
 * Input Spinner
 * @author Damii
 */
class NumericInput extends Component<INumericInputProps, INumericInputStates> {
  /**
   * Constructor
   * @param props
   */

  decimalInput: boolean = false;
  constructor(props) {
    super(props);

    let spinnerStep = this.parseNum(this.props.step);
    if (!this.typeDecimal() && spinnerStep < 1) {
      spinnerStep = 1;
    }

    this.state = {
      min: this.parseNum(this.props.min),
      max: this.parseNum(this.props.max),
      value: this.parseNum(this.props.value),
      step: spinnerStep,
      buttonPress: null,
      showButtons: props.showButtons,
    };
  }

  static defaultProps = {
    type: 'int',
    min: 0,
    max: 99999999,
    value: 0,
    step: 1,
    precision: 2,
    rounded: true,
    activeOpacity: 0.85,
    color: defaultColor,
    colorButton: defaultColor,
    backgroundButton: 'transparent',
    colorPress: defaultColor,
    background: 'transparent',
    textColor: COLORS.TEXT_DARK,
    arrows: false,
    showBorder: true,
    fontSize: SIZES.H6,
    fontFamily: SIZES.FONTFAMILY,
    buttonfontSize: SIZES.H3,
    buttonFontFamily: SIZES.FONTFAMILY,
    buttonTextColor: defaultColor,
    buttonPressTextColor: COLORS.BACKGROUND,
    disabled: false,
    editable: true,
    width: 175,
    height: 45,
    buttonLeftDisabled: false,
    buttonRightDisabled: false,
    buttonLeftText: null,
    buttonRightText: null,
    buttonStyle: {},
    buttonPressStyle: {},
    inputStyle: {},
    style: {},
    showButtons: true,
    focusShowButtons: true,
    delay: 1500,
  };

  /**
   * Component did update
   * @param prevProps
   * @returns {*}
   */
  componentDidUpdate(prevProps) {
    // Parse Value
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.parseNum(this.props.value) });
    }
    // Parse Min
    if (this.props.min !== prevProps.min) {
      this.setState({ min: this.parseNum(this.props.min) });
    }
    // Parse Max
    if (this.props.max !== prevProps.max) {
      this.setState({ max: this.parseNum(this.props.max) });
    }
    // Parse Step
    if (this.props.step !== prevProps.step) {
      let spinnerStep = this.parseNum(this.props.step);
      if (!this.typeDecimal() && spinnerStep < 1) {
        spinnerStep = 1;
      }
      this.setState({ step: spinnerStep });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.debounce);
    clearTimeout(this._debounce);
  }

  private debounce;
  /**
   * On value change
   * @param num
   */
  onChange(num) {
    if (this.props.disabled) return;
    const current_value = this.state.value;
    if (String(num).endsWith('.') && !this.getValue().endsWith('.0')) {
      this.decimalInput = true;
    }
    num = this.parseNum(String(num).replace(/^0+/, '')) || 0;
    if (!this.minReached(num)) {
      if (this.maxReached(num)) {
        num = this.state.max;
        if (this.props.onMax) {
          this.props.onMax(this.state.max);
        }
      }
      this.setState({ value: num });
    } else {
      if (this.props.onMin) {
        this.props.onMin(this.state.min);
      }
      num = this.state.min;
      this.setState({ value: num });
    }
    if (current_value !== num && this.props.onChange) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.props.onChange && this.props.onChange!(num);
      }, this.props.delay);
    }
  }

  /**
   * On Button Press
   * @param buttonDirection
   */
  onShowUnderlay(buttonDirection) {
    this.setState({ buttonPress: buttonDirection });
  }

  /**
   * On Button Unpress
   */
  onHideUnderlay() {
    this.setState({ buttonPress: null });
  }

  /**
   * Round number to props precision
   * @param num
   */
  roundNum(num) {
    if (this.typeDecimal()) {
      let val: number = num * Math.pow(10, this.props.precision);
      let fraction = Math.round((val - parseInt(val.toString())) * 10) / 10;
      if (fraction === -0.5) {
        fraction = -0.6;
      }
      val =
        Math.round(parseInt(val.toString()) + fraction) /
        Math.pow(10, this.props.precision);
      return val;
    }
    return num;
  }

  /**
   * Parse number type
   * @param num
   * @returns {*}
   */
  parseNum(num) {
    if (this.typeDecimal()) {
      num = parseFloat(num);
    } else {
      num = parseInt(num);
    }
    if (isNaN(num)) {
      num = 0;
    }
    this.roundNum(num);
    return num;
  }

  /**
   * Convert value to string
   * @returns {string}
   */
  getValue() {
    let { value } = this.state;
    if (this.typeDecimal() && this.decimalInput) {
      this.decimalInput = false;
      return this.parseNum(value).toFixed(1);
    } else if (this.typeDecimal()) {
      value = this.parseNum(value).toFixed(this.props.precision);
    }
    return String(this.parseNum(value));
  }

  /**
   * Get Type
   * @returns {String}
   */
  getType() {
    let type = this.props.type;
    if (this.props.type != null) {
      type = this.props.type;
    }
    return String(type).toLowerCase();
  }

  /**
   * Detect if type is decimal
   * @returns {boolean}
   */
  typeDecimal() {
    let type = this.getType();
    return (
      type === 'float' ||
      type === 'double' ||
      type === 'decimal' ||
      type === 'real'
    );
  }

  /**
   * Increase
   */
  increase() {
    if (this._isDisabledButtonRight()) return;
    let num = this.parseNum(this.state.value) + this.parseNum(this.state.step);
    if (this.props.onIncrease) {
      let increased_num = num;
      if (this.maxReached(num)) {
        increased_num = this.state.max;
      }
      this.props.onIncrease(increased_num);
    }
    this.onChange(num);
  }

  /**
   * Decrease
   */
  decrease() {
    if (this._isDisabledButtonLeft()) return;
    let num = this.parseNum(this.state.value) - this.parseNum(this.state.step);
    if (this.props.onDecrease) {
      let decreased_num = num;
      if (this.minReached(num)) {
        decreased_num = this.state.min;
      }
      this.props.onDecrease(decreased_num);
    }
    this.onChange(num);
  }

  /**
   * Max is reached
   * @param num
   * @returns {boolean}
   */
  maxReached(num: number | null = null) {
    if (num == null) {
      num = this.state.value;
    }
    return num >= this.state.max;
  }

  /**
   * Min is reached
   * @param num
   * @returns {boolean}
   */
  minReached(num: number | null = null) {
    if (num == null) {
      num = this.state.value;
    }
    return num <= this.state.min;
  }

  /**
   * Is object empty
   * @param obj
   * @returns {boolean}
   */
  isObjectEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  /**
   * Is text input editable
   * @returns {boolean|Boolean}
   */
  isEditable() {
    return !this.props.disabled && this.props.editable;
  }

  /**
   * Is left button disabled
   * @returns {Boolean}
   * @private
   */
  _isDisabledButtonLeft() {
    return this.props.disabled || this.props.buttonLeftDisabled;
  }

  /**
   * Is right button disabled
   * @returns {Boolean}
   * @private
   */
  _isDisabledButtonRight() {
    return this.props.disabled || this.props.buttonRightDisabled;
  }

  /**
   * Is right button pressed
   * @returns {boolean}
   * @private
   */
  _isRightButtonPressed() {
    return this.state.buttonPress === 'right';
  }

  /**
   * Is left button pressed
   * @returns {boolean}
   * @private
   */
  _isLeftButtonPressed() {
    return this.state.buttonPress === 'left';
  }

  /**
   * Get keyboard type
   * @returns {string}
   * @private
   */
  _getKeyboardType() {
    // Keyboard type
    let keyboardType = 'numeric';
    if (this.typeDecimal()) {
      keyboardType = 'decimal-pad';
    } else {
      keyboardType = 'number-pad';
    }
    return keyboardType;
  }

  /**
   * Get main color
   * @returns {String|*}
   * @private
   */
  _getColor(right: boolean) {
    return this.maxReached() && right
      ? this._getColorMax()
      : this.minReached() && !right
      ? this._getColorMin()
      : this.props.color;
  }

  /**
   * Get min color
   * @returns {String}
   * @private
   */
  _getColorMin() {
    if (!this.props.colorMin) {
      return this.props.color;
    }
    return this.props.colorMin;
  }

  /**
   * Get max color
   * @returns {String}
   * @private
   */
  _getColorMax() {
    if (!this.props.colorMax) {
      return this.props.color;
    }
    return this.props.colorMax;
  }

  /**
   * Get color on button press
   * @returns {String|*}
   * @private
   */
  _getColorPress(right: boolean) {
    const color =
      this.props.colorPress !== defaultColor
        ? this.props.colorPress
        : this.props.color;
    return this.maxReached() && right
      ? this._getColorMax()
      : this.minReached() && !right
      ? this._getColorMin()
      : color;
  }

  /**
   * Get color text on button press
   * @returns {string}
   * @private
   */
  _getColorPressText() {
    return this.props.buttonPressTextColor !== this.props.buttonTextColor
      ? this.props.buttonPressTextColor
      : this.props.buttonTextColor;
  }

  /**
   * Get button color
   * @returns {string}
   * @private
   */
  _getColorButton(right: boolean) {
    const color = this._getColor(right);
    return this.props.colorButton !== defaultColor
      ? this.props.colorButton
      : color;
  }

  /**
   * Get Background button color
   * @returns {string}
   * @private
   */
  _getBackgroundButton(right: boolean) {
    const color = this._getColor(right);
    return this.props.backgroundButton !== defaultColor
      ? this.props.backgroundButton
      : color;
  }

  /**
   * Get container style
   * @returns {*[]}
   * @private
   */
  _getContainerStyle() {
    return [
      styles.container,
      {
        width: this.props.width,
      },
      this.props.style,
    ];
  }

  /**
   * Get input text style
   * @returns {*[]}
   * @private
   */
  _getInputTextStyle() {
    return [
      styles.numberText,
      {
        color: this.props.textColor,
        fontSize: this.props.fontSize,
        fontFamily: this.props.fontFamily,
        backgroundColor: this.props.background,
        height: this.props.height,
      },
      this.props.inputStyle,
    ];
  }

  /**
   * Get button style
   * @returns {*}
   * @private
   */
  _getStyleButton() {
    const size = this.props.height;
    return {
      height: size,
      width: size,
    };
  }

  /**
   * Get button pressed style
   * @returns {Object}
   * @private
   */
  _getStyleButtonPress() {
    return this.isObjectEmpty(this.props.buttonPressStyle)
      ? this.props.buttonStyle
      : this.props.buttonPressStyle;
  }

  /**
   * Get button text style
   * @returns {*[]}
   * @private
   */
  _getStyleButtonText() {
    const lineHeight: number | undefined = !isNaN(
      parseInt(String(this.props.height))
    )
      ? (this.props.height as number) -
        ((this.props.height as number) - this.props.buttonFontSize - 3) / 2
      : undefined;
    return [
      styles.buttonText,
      {
        lineHeight: lineHeight,
        fontSize: this.props.buttonFontSize,
        fontFamily: this.props.buttonFontFamily,
      },
    ];
  }

  /**
   * Get left button text style
   * @returns {*[]}
   * @private
   */
  _getStyleLeftButtonText() {
    return [
      styles.buttonText,
      this._getStyleButtonText(),
      {
        color: this._isLeftButtonPressed()
          ? this._getColorPressText()
          : this.props.showBorder
          ? this._getColorButton(false)
          : this.props.buttonTextColor,
      },
    ];
  }

  /**
   * Get right button text style
   * @returns {*[]}
   * @private
   */
  _getStyleRightButtonText() {
    return [
      styles.buttonText,
      this._getStyleButtonText(),
      {
        color: this._isRightButtonPressed()
          ? this._getColorPressText()
          : this.props.showBorder
          ? this._getColorButton(true)
          : this.props.buttonTextColor,
      },
    ];
  }

  /**
   * Render left button element
   * @returns {*}
   * @private
   */
  _renderLeftButtonElement() {
    if (this.props.buttonLeftImage) {
      return this.props.buttonLeftImage;
    } else if (this._isLeftButtonPressed() && this.props.buttonPressLeftImage) {
      return this.props.buttonPressLeftImage;
    } else {
      const text =
        this.props.arrows !== false
          ? '<'
          : this.props.buttonLeftText
          ? this.props.buttonLeftText
          : '-';
      return <Text style={this._getStyleLeftButtonText()}>{text}</Text>;
    }
  }

  /**
   * Render right button element
   * @returns {*}
   * @private
   */
  _renderRightButtonElement() {
    if (this.props.buttonRightImage) {
      return this.props.buttonRightImage;
    } else if (
      this._isRightButtonPressed() &&
      this.props.buttonPressRightImage
    ) {
      return this.props.buttonPressRightImage;
    } else {
      const text =
        this.props.arrows !== false
          ? '>'
          : this.props.buttonRightText
          ? this.props.buttonRightText
          : '+';
      return <Text style={this._getStyleRightButtonText()}>{text}</Text>;
    }
  }

  /**
   * Render left button
   * @returns {*}
   * @private
   */
  _renderLeftButton() {
    const buttonStyle = [
      this._getStyleButton(),
      {
        borderColor: this.props.showBorder
          ? this._getColorButton(false)
          : 'transparent',
        backgroundColor: this._getBackgroundButton(false),
      },
      this.props.rounded ? styles.buttonRounded : styles.buttonLeft,
      this._isLeftButtonPressed()
        ? this._getStyleButtonPress()
        : this.props.buttonStyle,
    ];

    return (
      <TouchableHighlight
        activeOpacity={this.props.activeOpacity}
        underlayColor={this._getColorPress(false)}
        onHideUnderlay={this.onHideUnderlay.bind(this)}
        onShowUnderlay={this.onShowUnderlay.bind(this, 'left')}
        disabled={this._isDisabledButtonLeft()}
        style={buttonStyle}
        onPress={() => this.decrease()}
      >
        {this._renderLeftButtonElement()}
      </TouchableHighlight>
    );
  }

  /**
   * Render right button
   * @returns {*}
   * @private
   */
  _renderRightButton() {
    const buttonStyle = [
      this._getStyleButton(),
      {
        borderColor: this.props.showBorder
          ? this._getColorButton(true)
          : 'transparent',
        backgroundColor: this._getBackgroundButton(true),
      },
      this.props.rounded ? styles.buttonRounded : styles.buttonRight,
      this._isRightButtonPressed()
        ? this._getStyleButtonPress()
        : this.props.buttonStyle,
    ];

    return (
      <TouchableHighlight
        activeOpacity={this.props.activeOpacity}
        underlayColor={this._getColorPress(true)}
        onHideUnderlay={this.onHideUnderlay.bind(this)}
        onShowUnderlay={this.onShowUnderlay.bind(this, 'right')}
        disabled={this._isDisabledButtonRight()}
        style={buttonStyle}
        onPress={() => this.increase()}
      >
        {this._renderRightButtonElement()}
      </TouchableHighlight>
    );
  }

  private _debounce;
  isEndEditing = () => {
    if (!this.props.showButtons) {
      this._debounce = setTimeout(() => {
        if (this.state.showButtons) {
          this.setState({ showButtons: false });
        }
      }, this.props.delay);
    }
  };

  isFocus = () => {
    if (this.props.focusShowButtons && !this.state.showButtons) {
      this.setState({ showButtons: true });
    }
  };

  /**
   * Render
   * @returns {*}
   */
  render() {
    return (
      <View style={this._getContainerStyle()}>
        {this.state.showButtons ? this._renderLeftButton() : null}
        {this.props.prepend}
        <TextInput
          style={this._getInputTextStyle()}
          value={this.getValue()}
          editable={this.isEditable()}
          //onEndEditing={this.isEndEditing}
          onFocus={this.isFocus}
          selectTextOnFocus={!this.props.focusShowButtons}
          keyboardType={
            (this._getKeyboardType() as KeyboardTypeOptions) || 'numeric'
          }
          onChangeText={this.onChange.bind(this)}
        />

        {this.props.children}
        {this.props.append}

        {this.state.showButtons ? this._renderRightButton() : null}
      </View>
    );
  }
}

export default NumericInput;
