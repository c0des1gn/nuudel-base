import React, { Component, Fragment } from 'react';
import Text from '../Text';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Separator from '../Separator';
import { Navigation } from 'react-native-navigation';
import { styles } from './styled';
import { COLORS, SIZES } from '../../theme';

interface IMenuBarProps {
  componentId: string;
  data: IMenuBarDate[];
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
}

export interface IMenuBarDate {
  text: string;
  icon: string;
  id: string;
  name: string;
}

interface IMenuBarState {}

export class MenuBar extends Component<IMenuBarProps, IMenuBarState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  protected handleScreen = (id: string, ScreenName: any) =>
    Navigation.push(id, {
      component: {
        name: ScreenName,
        passProps: {
          ...this.props,
        },
      },
    });

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.backgroundColor,
            borderBottomColor: this.props.borderColor || COLORS.INFO,
          },
        ]}
      >
        {!!this.props.data &&
          this.props.data.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && <Separator style={{ marginVertical: 10 }} />}
              <TouchableOpacity
                style={[styles.item]}
                key={i}
                onPress={() => {
                  this.handleScreen(item.id, item.name);
                }}
              >
                <Text style={{ color: this.props.color, marginBottom: 0 }}>
                  <Icon name={item.icon} color={COLORS.ICON} /> {item.text}
                </Text>
              </TouchableOpacity>
            </Fragment>
          ))}
      </View>
    );
  }
}

export default MenuBar;
