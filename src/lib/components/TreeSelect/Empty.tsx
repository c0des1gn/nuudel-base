import React, { FC, useState } from 'react';
import { View, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { useTheme } from 'react-native-elements';
import { useStyles } from './styled';

interface IProps {
  icon?: string;
  text?: string;
  desc?: string;
}

export const EmptyList: FC<IProps> = ({
  icon = 'box',
  text = '',
  desc = '',
  ...props
}) => {
  const styles = useStyles(props);
  const { theme } = useTheme();
  const { COLORS, SIZES } = theme as any;
  const [height, setHeight] = useState(200);
  return (
    <View
      style={[
        styles.emptyWishContainer,
        { height: Platform.OS === 'android' ? height : 'auto' },
      ]}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
      }}
    >
      <View style={styles.box}>
        <Icon name={icon} size={SIZES.ICON_HUGE} color={COLORS.TEXT_LIGHT} />
        <Text style={styles.emptyText}>{text}</Text>
        {!!desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
    </View>
  );
};

export default EmptyList;
