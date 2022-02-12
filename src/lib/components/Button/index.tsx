import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button as BaseButton, ButtonProps } from 'react-native-elements';
import Text from '../Text';
import { styles } from '../../theme/styles';
import {
  TouchableHighlight,
  TouchableHighlightProps,
  StyleSheet,
} from 'react-native';

interface IProps {
  title?: string;
  timeout?: number;
  transparent?: boolean;
}

export const Button: FunctionComponent<ButtonProps & IProps> = ({
  children,
  timeout = 1200,
  style = {},
  buttonStyle = {},
  containerStyle = {},
  titleStyle = {},
  ...props
}) => {
  //const [_debounce, setDebounce] = useState();
  let _debounce: any = undefined;
  useEffect(() => {
    //function cleanup()
    return () => {
      clearTimeout(_debounce);
    };
  }, []);

  const onClick = (e?: any) => {
    if (timeout) {
      if (!_debounce) {
        props.onPress && props.onPress(e);
      } else {
        clearTimeout(_debounce);
      }
      _debounce = setTimeout(() => {
        //setDebounce(undefined);
        _debounce = undefined;
      }, timeout);
    } else {
      props.onPress && props.onPress(e);
    }
  };
  return (
    <BaseButton
      {...props}
      title={
        typeof children === 'string' && !props.title ? children : props.title
      }
      onPress={onClick}
      containerStyle={[styles.containerButton, containerStyle]}
      buttonStyle={StyleSheet.flatten(
        props.type === 'outline'
          ? [buttonStyle, style]
          : [styles.Button, buttonStyle, style]
      )}
      titleStyle={[styles.ButtonText, titleStyle]}
    >
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text style={[styles.ButtonText, titleStyle]}>{children}</Text>
      )}
    </BaseButton>
  );
};

interface TouchableProps extends TouchableHighlightProps {
  timeout: number;
}

export class Touchable extends React.Component<TouchableProps, any> {
  protected LongClick: boolean;
  protected _debounce: any = undefined;
  constructor(props: TouchableProps) {
    super(props);
    this.LongClick = false;
    this.state = {};
  }

  static defaultProps = {
    timeout: 1200,
  };

  protected onClickIn = (e?: any) => {
    this.LongClick = false;
    this.props.onPressIn && this.props.onPressIn(e);
  };

  protected onClickOut = (e) => {
    if (this.LongClick) {
      this.props.onPressOut && this.props.onPressOut(e);
    }
    this.LongClick = false;
  };

  protected onLongClick = (e) => {
    this.LongClick = true;
    this.props.onLongPress && this.props.onLongPress(e);
  };

  protected onClick = (e) => {
    this.LongClick = false;
    if (this.props.timeout) {
      if (!this._debounce) {
        this.props.onPress && this.props.onPress(e);
      } else {
        clearTimeout(this._debounce);
      }
      this._debounce = setTimeout(() => {
        this._debounce = undefined;
      }, this.props.timeout);
    } else {
      this.props.onPress && this.props.onPress(e);
    }
  };

  componentWillUnmount() {
    clearTimeout(this._debounce);
  }

  render() {
    return (
      <TouchableHighlight
        {...this.props}
        onPress={this.onClick}
        onPressIn={this.onClickIn}
        onPressOut={this.onClickOut}
        onLongPress={this.onLongClick}
      />
    );
  }
}

export default Button;
