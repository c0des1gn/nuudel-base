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
  size?: number;
  color?: string;
  animating?: boolean;
  hidesWhenStopped?: boolean;
  style?: StyleProp<any>;
  overflowHide?: boolean;
  name?: ISpinner;
}

const getComponent = (name: string = 'Flow') => {
  let component: any = undefined;
  if (name === 'Plane') {
    component = Plane;
  } else if (name === 'Pulse') {
    component = Pulse;
  } else if (name === 'Bounce') {
    component = Bounce;
  } else if (name === 'Swing') {
    component = Swing;
  } else if (name === 'Chase') {
    component = Chase;
  } else if (name === 'Wave') {
    component = Wave;
  } else if (name === 'Circle') {
    component = Circle;
  } else if (name === 'CircleFade') {
    component = CircleFade;
  } else if (name === 'Grid') {
    component = Grid;
  } else if (name === 'Fold') {
    component = Fold;
  } else if (name === 'Wander') {
    component = Wander;
  } else {
    component = Flow;
  }
  return component;
};

export const Loading: React.FC<ILoadingProps> = ({
  size = SIZES.ICON_HUGE,
  color = COLORS.ICON_LIGHT,
  animating = true,
  hidesWhenStopped = true,
  name = 'Flow',
  ...props
}) => {
  const Spinner = getComponent(name);
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
