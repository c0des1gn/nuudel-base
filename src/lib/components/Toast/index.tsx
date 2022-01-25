/**
 * toast
 */
import React, { Component, ReactElement } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  ViewProps,
  TextProps,
} from 'react-native';
import { COLORS, SIZES } from '../../theme';

export type Position = 'bottom' | 'top' | 'center';
export type Type = 'danger' | 'success' | 'warning' | 'info' | 'error';

interface IToastProps {
  style?: ViewProps | any;
  textStyle?: TextProps | any;
  position: Position;
  positionValue: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  opacity: number;
  defaultCloseDelay: number;
}

interface IToastState {
  isShow: boolean;
  position: Position;
  text: string | ReactElement | Component;
  opacityValue: Animated.Value;
  type: Type;
}

const { height, width } = Dimensions.get('screen');

export class Toast extends Component<IToastProps, IToastState> {
  protected _animation: any;
  protected _duration: number = 1000;
  protected _callback: Function | undefined = undefined;
  protected _timer: any;
  protected _isShow: boolean = false;
  protected readonly _FOREVER: number = 0;
  protected _mounted: boolean = false;
  constructor(props: IToastProps) {
    super(props);
    this.state = {
      isShow: false,
      position: props.position,
      text: '',
      opacityValue: new Animated.Value(props.opacity),
      type: 'info',
    };
  }

  static defaultProps = {
    position: 'bottom' as const,
    positionValue: 15,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    defaultCloseDelay: 250,
    opacity: 1,
  };

  public show(
    text: string | ReactElement | Component,
    type: Type = 'info',
    position: Position = 'bottom',
    duration: number = 1000,
    onClose?: Function
  ) {
    this._duration = duration;
    this._callback = onClose;
    this.setState({
      isShow: true,
      position,
      text,
      type,
    });

    this._animation = Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration,
      useNativeDriver: true,
    });
    this._animation.start(() => {
      this._isShow = true;
      if (duration !== this._FOREVER) this.close();
    });
  }

  public isShowing(): boolean {
    return this._isShow;
  }

  public close(duration: number = this._duration) {
    let delay = duration;

    if (delay === this._FOREVER) delay = this.props.defaultCloseDelay || 250;

    if (!this._isShow && !this.state.isShow) return;
    this._timer && clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._animation = Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration,
        useNativeDriver: true,
      });
      this._animation.start(() => {
        if (this._mounted) {
          this.setState({
            isShow: false,
          });
        }
        this._isShow = false;
        if (typeof this._callback === 'function') {
          this._callback();
        }
      });
    }, delay);
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
    this._animation && this._animation.stop();
    this._timer && clearTimeout(this._timer);
  }

  render() {
    const { position, type, opacityValue, text } = this.state;
    let style: any = {};
    switch (position) {
      case 'top':
        style = { top: this.props.positionValue };
        break;
      case 'center':
        style = { top: height / 2 - 100 };
        break;
      case 'bottom':
        style = { bottom: this.props.positionValue + 25 };
        break;
    }
    let color: string = COLORS.INFO;
    switch (type) {
      /** Info styled Toast */
      case 'info':
        color = COLORS.INFO;
        break;
      /** Error styled Toast */
      case 'danger':
      case 'error':
        color = COLORS.DANGER;
        break;
      /** Success styled Toast */
      case 'success':
        color = COLORS.SUCCESS;
        break;
      /** Warning styled Toast */
      case 'warning':
        color = COLORS.WARNING;
        break;
      default:
        color = COLORS.SHADOW;
        break;
    }
    return this.state.isShow ? (
      <View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
            zIndex: 1000,
            elevation: 1000,
          },
          style,
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            {
              borderRadius: SIZES.BORDER_RADIUS,
              paddingVertical: SIZES.PADDING,
              paddingHorizontal: SIZES.PADDING_HALF,
              backgroundColor: color,
              opacity: opacityValue || this.props.opacity,
              width: width - SIZES.PADDING * 2,
            },
            this.props.style,
          ]}
        >
          {React.isValidElement(text) ? (
            text
          ) : (
            <Text
              style={[
                {
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  color: COLORS.BACKGROUND,
                  fontFamily: SIZES.FONTFAMILY,
                  fontSize: SIZES.H6,
                },
                this.props.textStyle,
              ]}
            >
              {text}
            </Text>
          )}
        </Animated.View>
      </View>
    ) : null;
  }
}

export default Toast;
