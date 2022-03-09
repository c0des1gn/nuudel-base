// React and react native imports
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '../../theme/';
//import { View as AnimatableView } from 'react-native-animatable';

// Local file imports
import StarButton from './StarButton';

export interface IStarRating {
  children?: any;
  activeOpacity: number;
  buttonStyle: any;
  style: any;
  disabled: boolean;
  emptyStar: any;
  emptyStarColor: string;
  fullStar: any;
  fullStarColor: string;
  halfStar: any;
  halfStarColor: string;
  halfStarEnabled: boolean;
  maxStars: number;
  rating: number;
  reversed: boolean;
  starSize: number;
  starStyle: any;
  Ico: any;
  selectedStar(rate: number): void;
}

class StarRating extends Component<IStarRating, any> {
  starRef: any;
  constructor(props) {
    super(props);

    this.starRef = [];
    this.onStarButtonPress = this.onStarButtonPress.bind(this);
  }

  static defaultProps = {
    activeOpacity: 0.2,
    buttonStyle: {},
    style: {},
    disabled: false,
    emptyStar: 'star-empty',
    emptyStarColor: COLORS.ICON_LIGHT,
    fullStar: 'star',
    fullStarColor: COLORS.ICON,
    halfStar: 'star-half-alt',
    halfStarColor: undefined,
    halfStarEnabled: false,
    maxStars: 5,
    rating: 0,
    reversed: false,
    starSize: SIZES.H4,
    starStyle: {},
    selectedStar: () => {},
  };

  onStarButtonPress(rating) {
    const { selectedStar } = this.props;

    selectedStar(rating);
  }

  render() {
    const {
      children,
      activeOpacity,
      buttonStyle,
      style,
      disabled,
      emptyStar,
      emptyStarColor,
      fullStar,
      fullStarColor,
      halfStar,
      halfStarColor,
      halfStarEnabled,
      maxStars,
      rating,
      reversed,
      starSize,
      starStyle,
      Ico,
    } = this.props;

    const ContainerStyle = {
      flexDirection: reversed ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      ...StyleSheet.flatten(style),
    };

    // Round rating down to nearest .5 star
    let starsLeft = Math.round(rating * 2) / 2;
    const starButtons: any[] = [];
    for (let i = 0; i < maxStars; i++) {
      let starIconName = emptyStar;
      let finalStarColor = emptyStarColor;

      if (starsLeft >= 1) {
        starIconName = fullStar;
        finalStarColor = fullStarColor;
      } else if (starsLeft === 0.5) {
        starIconName = halfStar;
        if (halfStarColor) {
          finalStarColor = halfStarColor;
        } else {
          finalStarColor = fullStarColor;
        }
      }
      const starButtonElement = (
        //AnimatableView
        <View
          key={i}
          ref={(node) => {
            this.starRef.push(node);
          }}
        >
          <StarButton
            activeOpacity={activeOpacity}
            buttonStyle={buttonStyle}
            disabled={disabled}
            halfStarEnabled={halfStarEnabled}
            onStarButtonPress={(event) => {
              this.onStarButtonPress(event);
            }}
            rating={i + 1}
            reversed={reversed}
            starColor={finalStarColor}
            starIconName={starIconName}
            starSize={starSize}
            starStyle={starStyle}
            Ico={
              !Ico ? undefined : (
                <Ico
                  name={starIconName}
                  size={starSize}
                  color={finalStarColor}
                />
              )
            }
          />
        </View>
      );

      starButtons.push(starButtonElement);
      starsLeft -= 1;
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={ContainerStyle} pointerEvents={disabled ? 'none' : 'auto'}>
          {starButtons}
        </View>
        {typeof children === 'string' ? (
          <Text>{children}</Text>
        ) : React.isValidElement(children) ? (
          children
        ) : null}
      </View>
    );
  }
}

export default StarRating;
