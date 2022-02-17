import React from 'react';
import { StyleProp, View } from 'react-native';
import {
  Flow,
  Plane,
  Bounce,
  Pulse,
  Swing,
  Chase,
  Wave,
  Circle,
  CircleFade,
  Grid,
  Fold,
  Wander,
} from 'react-native-animated-spinkit';
import { COLORS, SIZES } from '../../theme';

type ISpinner =
  | undefined
  | 'Flow'
  | 'Plane'
  | 'Bounce'
  | 'Pulse'
  | 'Swing'
  | 'Chase'
  | 'Wave'
  | 'Circle'
  | 'CircleFade'
  | 'Grid'
  | 'Fold'
  | 'Wander';

export interface ILoadingProps {
  size: number;
  color: string;
  animating: boolean;
  hidesWhenStopped: boolean;
  style?: StyleProp<any>;
  overflowHide: boolean;
  spinner?: ISpinner;
}

const getComponent = (name: string = 'Flow') => {
  let component: any = undefined;
  if ('Plane') {
    component = Plane;
  } else if ('Pulse') {
    component = Pulse;
  } else if ('Bounce') {
    component = Bounce;
  } else if ('Swing') {
    component = Swing;
  } else if ('Chase') {
    component = Chase;
  } else if ('Wave') {
    component = Wave;
  } else if ('Circle') {
    component = Circle;
  } else if ('CircleFade') {
    component = CircleFade;
  } else if ('Grid') {
    component = Grid;
  } else if ('Fold') {
    component = Fold;
  } else if ('Wander') {
    component = Wander;
  } else {
    // Flow
    component = Flow;
  }
  return component;
};

export const Loading: React.FC<ILoadingProps> = ({
  size = SIZES.ICON_HUGE,
  color = COLORS.ICON_LIGHT,
  animating = true,
  hidesWhenStopped = true,
  ...props
}) => {
  const Spinner = getComponent(props.spinner);
  return props?.overflowHide === true ? (
    <Spinner
      size={size}
      color={color}
      animating={animating}
      hidesWhenStopped={hidesWhenStopped}
    />
  ) : (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}
    >
      <Spinner
        size={size}
        color={color}
        animating={animating}
        hidesWhenStopped={hidesWhenStopped}
      />
    </View>
  );
};

export default Loading;
