import React from 'react';
import { styles } from './styled';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { t } from 'nuudel-utils';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import { COLORS, SIZES } from '../../theme';

interface IRadioForm {
  radio_props: any[];
  initial: number;
  buttonColor: string;
  selectedButtonColor: string;
  formHorizontal: boolean;
  labelHorizontal: boolean;
  animation: boolean;
  labelColor: string;
  selectedLabelColor: string;
  wrapStyle: any;
  disabled: boolean;
  accessible: boolean;
  accessibilityLabel?: string;
  style?: any;
  testID?: string;
  buttonSize: number;
  buttonOuterSize: number;
  radioStyle?: any;
  labelStyle?: any;
  onPress(v: string, i: number);
}

interface IRadioFormState {
  is_active_index: number;
}

class RadioForm extends React.Component<IRadioForm, IRadioFormState> {
  constructor(props) {
    super(props);
    this.state = {
      is_active_index: props.initial,
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  static defaultProps = {
    radio_props: [],
    initial: 0,
    buttonColor: COLORS.PRIMARY,
    selectedButtonColor: COLORS.PRIMARY,
    formHorizontal: false,
    labelHorizontal: true,
    animation: true,
    labelColor: COLORS.TEXT_DARK,
    selectedLabelColor: COLORS.TEXT_DARK,
    wrapStyle: {},
    disabled: false,
    accessible: true,
    buttonSize: 10,
    buttonOuterSize: 20,
  };

  updateIsActiveIndex(index) {
    this.setState({ is_active_index: index });
    this.props.onPress(this.props.radio_props[index], index);
  }

  //This function is for clear the selection when we are using the library in multiple choice questions
  clearSelection() {
    this.setState({ is_active_index: -1 });
  }

  _renderButton = (obj, i) => {
    return (
      <RadioButton
        styles={styles}
        accessible={this.props.accessible}
        accessibilityLabel={
          this.props.accessibilityLabel
            ? this.props.accessibilityLabel + '|' + i
            : 'radioButton' + '|' + i
        }
        testID={
          this.props.testID
            ? this.props.testID + '|' + i
            : 'radioButton' + '|' + i
        }
        isSelected={this.state.is_active_index === i}
        obj={obj}
        key={i}
        index={i}
        buttonColor={
          this.state.is_active_index === i
            ? this.props.selectedButtonColor
            : this.props.buttonColor
        }
        buttonSize={this.props.buttonSize}
        buttonOuterSize={this.props.buttonOuterSize}
        labelHorizontal={this.props.labelHorizontal}
        labelColor={
          this.state.is_active_index === i
            ? this.props.selectedLabelColor
            : this.props.labelColor
        }
        labelStyle={this.props.labelStyle}
        style={this.props.radioStyle}
        animation={this.props.animation}
        disabled={this.props.disabled}
        onPress={(value, index) => {
          this.props.onPress(value, index);
          this.setState({ is_active_index: index });
        }}
      />
    );
  };

  render() {
    let render_content: any = false;
    if (this.props.radio_props.length) {
      render_content = this.props.radio_props.map(this._renderButton);
    } else {
      render_content = this.props.children;
    }
    return (
      <View
        style={[
          styles.radioFrom,
          this.props.style,
          this.props.formHorizontal && styles.formHorizontal,
        ]}
      >
        {render_content}
      </View>
    );
  }
}

interface IRadioButton {
  animation: any;
  idSeparator: string;
  accessibilityLabel: string;
  testID: string;
  labelHorizontal: boolean;
  style: any;
  wrapStyle?: any;
  accessible: boolean;
  obj: any;
  index: number;
  buttonSize: number;
  buttonOuterSize: number;
  labelColor: string;
  labelStyle: any;
  onPress(v: string, i: number);
  isSelected: boolean;
  buttonColor: string;
  selectedButtonColor: string;
  disabled: boolean;
  styles?: any;
}

export class RadioButton extends React.Component<IRadioButton, any> {
  constructor(props: IRadioButton) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  static defaultProps = {
    isSelected: false,
    buttonColor: COLORS.PRIMARY,
    selectedButtonColor: COLORS.PRIMARY,
    labelHorizontal: true,
    disabled: false,
    idSeparator: '|',
  };
  componentDidUpdate() {
    if (this.props.animation) {
      LayoutAnimation.spring();
    }
  }
  render() {
    const { styles } = this.props;
    var c = this.props.children;

    var idSeparator = this.props.idSeparator ? this.props.idSeparator : '|';
    var idSeparatorAccessibilityLabelIndex = this.props.accessibilityLabel
      ? this.props.accessibilityLabel.indexOf(idSeparator)
      : -1;
    var idSeparatorTestIdIndex = this.props.testID
      ? this.props.testID.indexOf(idSeparator)
      : -1;

    var accessibilityLabel = this.props.accessibilityLabel
      ? idSeparatorAccessibilityLabelIndex !== -1
        ? this.props.accessibilityLabel.substring(
            0,
            idSeparatorAccessibilityLabelIndex
          )
        : this.props.accessibilityLabel
      : 'radioButton';
    var testID = this.props.testID
      ? idSeparatorTestIdIndex !== -1
        ? this.props.testID.substring(0, idSeparatorTestIdIndex)
        : this.props.testID
      : 'radioButton';

    var accessibilityLabelIndex =
      this.props.accessibilityLabel && idSeparatorAccessibilityLabelIndex !== -1
        ? this.props.accessibilityLabel.substring(
            idSeparatorAccessibilityLabelIndex + 1
          )
        : '';
    var testIDIndex =
      this.props.testID && testIDIndex !== -1
        ? this.props.testID.split(testIDIndex + 1)
        : '';

    let renderContent: any = false;
    renderContent = c ? (
      <View
        style={[
          styles.radioWrap,
          this.props.style,
          !this.props.labelHorizontal && styles.labelVerticalWrap,
        ]}
      >
        {c}
      </View>
    ) : (
      <View
        style={[
          styles.radioWrap,
          this.props.style,
          !this.props.labelHorizontal && styles.labelVerticalWrap,
          this.props.obj.uri && { marginVertical: 10 }, // , alignItems: 'center'
        ]}
      >
        {!this.props.obj.icon && (
          <RadioButtonInput
            {...this.props}
            accessibilityLabel={
              accessibilityLabel + 'Input' + accessibilityLabelIndex
            }
            testID={testID + 'Input' + testIDIndex}
          />
        )}
        <RadioButtonLabel
          {...this.props}
          accessibilityLabel={
            accessibilityLabel + 'Label' + accessibilityLabelIndex
          }
          testID={testID + 'Label' + testIDIndex}
        />
      </View>
    );
    return <View style={this.props.wrapStyle}>{renderContent}</View>;
  }
}

interface IRadioButtonInput {
  buttonStyle?: any;
  buttonSize: number;
  buttonOuterSize: number;
  buttonOuterColor: string;
  borderWidth?: number;
  buttonColor?: string;
  buttonInnerColor?: string;
  isSelected: boolean;
  buttonWrapStyle?: any;
  disabled: boolean;
  accessible: boolean;
  testID?: string;
  accessibilityLabel: string;
  obj: any;
  index: number;
  onPress(v: string, i: number);
  styles?: any;
}

interface IRadioButtonInputState {
  isSelected: boolean;
  buttonColor: string;
}

export class RadioButtonInput extends React.Component<
  IRadioButtonInput,
  IRadioButtonInputState
> {
  constructor(props: IRadioButtonInput) {
    super(props);
    this.state = {
      isSelected: false,
      buttonColor: props.buttonColor || COLORS.PRIMARY,
    };
  }

  static defaultProps = {
    buttonInnerColor: COLORS.PRIMARY,
    buttonOuterColor: COLORS.PRIMARY,
    disabled: false,
  };

  render() {
    const { styles } = this.props;
    var innerSize = { width: 20, height: 20, borderRadius: 20 / 2 };
    var outerSize = {
      width: 20 + 10,
      height: 20 + 10,
      borderRadius: (20 + 10) / 2,
    };
    if (this.props.buttonSize) {
      innerSize.width = this.props.buttonSize;
      innerSize.height = this.props.buttonSize;
      innerSize.borderRadius = this.props.buttonSize / 2;
      outerSize.width = this.props.buttonSize + 10;
      outerSize.height = this.props.buttonSize + 10;
      outerSize.borderRadius = (this.props.buttonSize + 10) / 2;
    }
    if (this.props.buttonOuterSize) {
      outerSize.width = this.props.buttonOuterSize;
      outerSize.height = this.props.buttonOuterSize;
      outerSize.borderRadius = this.props.buttonOuterSize / 2;
    }
    var outerColor = this.props.buttonOuterColor;
    var borderWidth = this.props.borderWidth || 3;
    var innerColor = this.props.buttonInnerColor;
    if (this.props.buttonColor) {
      outerColor = this.props.buttonColor;
      innerColor = this.props.buttonColor;
    }
    var c = (
      <View
        style={[
          styles.radioNormal,
          this.props.isSelected
            ? {
                ...styles.radioActive,
                ...innerSize,
                backgroundColor: innerColor,
              }
            : {},
        ]}
      />
    );
    var radioStyle = [
      styles.radio,
      {
        borderColor: outerColor,
        borderWidth: borderWidth,
      },
      this.props.buttonStyle,
      outerSize,
    ];

    if (this.props.disabled) {
      return (
        <View style={this.props.buttonWrapStyle}>
          <View style={radioStyle}>{c}</View>
        </View>
      );
    }

    return (
      <View style={this.props.buttonWrapStyle}>
        <TouchableOpacity
          accessible={this.props.accessible}
          accessibilityLabel={this.props.accessibilityLabel}
          testID={this.props.testID}
          style={radioStyle}
          onPress={() => {
            this.props.onPress(this.props.obj.value, this.props.index);
          }}
        >
          {c}
        </TouchableOpacity>
      </View>
    );
  }
}

interface IRadioButtonLabel {
  obj: any;
  accessible: boolean;
  onPress(v: string, i: number);
  testID: string;
  disabled: boolean;
  accessibilityLabel: string;
  index: number;
  labelColor: string;
  labelStyle: any;
  labelWrapStyle?: any;
  labelHorizontal: boolean;
  isSelected: boolean;
  selectedButtonColor: string;
  styles?: any;
}

interface IRadioButtonLabelState {
  isSelected: boolean;
  buttonColor: string;
}

export class RadioButtonLabel extends React.Component<
  IRadioButtonLabel,
  IRadioButtonLabelState
> {
  constructor(props: IRadioButtonLabel) {
    super(props);
    this.state = {
      isSelected: false,
      buttonColor: COLORS.PRIMARY,
    };
  }

  static defaultProps = {
    isSelected: false,
    selectedButtonColor: COLORS.PRIMARY,
  };

  render() {
    const { styles } = this.props;
    return (
      <TouchableWithoutFeedback
        accessible={this.props.accessible}
        accessibilityLabel={this.props.accessibilityLabel}
        testID={this.props.testID}
        onPress={() => {
          if (!this.props.disabled) {
            this.props.onPress(this.props.obj.value, this.props.index);
          }
        }}
      >
        <View style={[this.props.labelWrapStyle, styles.labelWrapStyle]}>
          {!this.props.obj.icon ? (
            <View style={styles.box}>
              {!!this.props.obj.uri && (
                <Image
                  source={{
                    uri: this.props.obj.uri,
                  }}
                  style={styles.image}
                />
              )}
              <Text
                style={[
                  styles.radioLabel,
                  !this.props.labelHorizontal && styles.labelVertical,
                  { color: this.props.labelColor },
                  this.props.labelStyle,
                ]}
              >
                {t(this.props.obj.label, {
                  defaultValue: this.props.obj.label,
                })}
              </Text>
            </View>
          ) : React.isValidElement(this.props.obj?.icon) ? (
            this.props.obj.icon
          ) : (
            <Icon
              style={styles.icon}
              name={this.props.obj?.icon}
              size={SIZES.ICON_LARGE}
              color={
                this.props.isSelected
                  ? this.props.selectedButtonColor
                  : this.props.labelColor
              }
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default RadioForm;
