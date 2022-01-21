// React and react native imports
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

export interface IStarButton {
  buttonStyle?: any;
  Ico?: any;
  disabled: boolean;
  halfStarEnabled: boolean;
  rating: number;
  reversed: boolean;
  starColor: string;
  starIconName: string;
  starSize: number;
  activeOpacity: number;
  starStyle?: any;
  onStarButtonPress(rate: number): void;
}

class StarButton extends Component<IStarButton, any> {
  constructor(props) {
    super(props);

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  static defaultProps = {
    buttonStyle: {},
    starStyle: {},
  };

  onButtonPress(event) {
    const { halfStarEnabled, starSize, rating, onStarButtonPress } = this.props;

    let addition = 0;

    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }

    onStarButtonPress(rating + addition);
  }

  render() {
    const {
      activeOpacity,
      buttonStyle,
      disabled,
      reversed,
      starColor,
      starIconName = 'star',
      starSize,
      starStyle,
      Ico,
    } = this.props;

    const newStarStyle = {
      transform: [
        {
          scaleX: reversed ? -1 : 1,
        },
      ],
      ...StyleSheet.flatten(starStyle),
    };
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        disabled={disabled}
        style={buttonStyle}
        onPress={this.onButtonPress}
      >
        {React.isValidElement(Ico) ? (
          Ico
        ) : (
          <Icon
            name={starIconName}
            size={starSize}
            color={starColor}
            style={newStarStyle}
          />
        )}
      </TouchableOpacity>
    );
  }
}

export default StarButton;
