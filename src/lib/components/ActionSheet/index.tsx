import React, { useState, CSSProperties, useEffect } from 'react';
import { BottomSheet, ListItem } from 'react-native-elements';

//import Text from '../Text';

interface IActionSheetProps {
  show?: boolean;
  title?: string;
  list: ISheetItemProps[];
}

interface ISheetItemProps {
  title: string;
  containerStyle?: CSSProperties | any;
  titleStyle?: CSSProperties | any;
  onPress?(e?: any);
}

export const ActionSheet: React.FC<IActionSheetProps> = (
  props: IActionSheetProps
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(props.show === true);
  }, [props.show]);

  return (
    <BottomSheet
      isVisible={isVisible}
      containerStyle={{
        //zIndex: 999,
        //elevation: 999,
        backgroundColor: 'rgba(0.5, 0.25, 0, 0.1)',
      }}
    >
      {!!props.title && <ListItem.Title>{props.title}</ListItem.Title>}
      {props.list.map((l: ISheetItemProps, i: number) => (
        <ListItem
          key={String(i)}
          containerStyle={l.containerStyle}
          onPress={l.onPress}
          hasTVPreferredFocus={false}
          tvParallaxProperties={false}
        >
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
};

export default ActionSheet;
