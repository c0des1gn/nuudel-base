import React, { FunctionComponent, useState } from 'react';
import { ButtonGroup as Button, ButtonGroupProps } from 'react-native-elements';

interface IProps extends ButtonGroupProps {
  buttons?: any[];
  selectedIndex?: number;
}

export const ButtonGroup: FunctionComponent<IProps> = ({
  children,
  buttons = [],
  selectedIndex = 0,
  onPress,
  ...props
}) => {
  const [index, setIndex] = useState(selectedIndex);
  const onClick = (i: number) => {
    onPress && onPress(i);
    setIndex(i);
  };

  return (
    <Button
      onPress={onClick}
      selectedIndex={index}
      buttons={buttons}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonGroup;
