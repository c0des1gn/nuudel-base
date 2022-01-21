import React, { Component } from 'react';
import { CheckBox, withTheme } from 'react-native-elements';
import { getStyle } from './styled';
import Text from '../Text';
import Item from '../Item';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import RadioForm from './RadioButton';

type Mode = 'select' | 'multiselect' | 'pick';

interface IChoicesProps {
  componentId?: string;
  formHorizontal: boolean;
  style?: any;
  context?: any;
  mode: Mode;
  selected: string[];
  data: IChoicesData[];
  onSubmit?(data);
  theme?: any;
}

export interface IChoicesData {
  value: string | any;
  label: string;
  icon?: string;
  uri?: string;
}

interface IChoicesState {
  selected: string[];
}

class Choices extends Component<IChoicesProps, IChoicesState> {
  constructor(props: IChoicesProps) {
    super(props);
    this.state = {
      selected: !props.selected
        ? []
        : props.selected instanceof Array
        ? props.selected
        : [props.selected],
    };
  }

  static defaultProps = {
    mode: 'select' as const,
    formHorizontal: false,
    selected: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected) {
      this.setState({
        selected: !this.props.selected
          ? []
          : this.props.selected instanceof Array
          ? this.props.selected
          : [this.props.selected],
      });
    }
  }

  componentWillUnmount() {
    if (this.props.onSubmit && this.props.mode === 'multiselect') {
      this.props.onSubmit(this.state.selected);
    }
  }

  protected onSelect = (value) => {
    let { selected } = this.state;
    let index = selected.indexOf(value);
    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(value);
    }
    this.setState({ selected: selected });
  };

  render() {
    const { COLORS, SIZES } = this.props?.theme;
    const styles = getStyle(COLORS, SIZES);

    const { selected } = this.state;
    let data: any[] = this.props.data;
    if (
      data instanceof Array &&
      data.length > 0 &&
      typeof data[0] === 'string'
    ) {
      data = data.map((item) => ({ value: item, label: item }));
    }
    return (
      <View style={[styles.container, this.props.style]}>
        {!!data && this.props.mode === 'multiselect' ? (
          data.map((item, i) => (
            <Item key={i} style={styles.item}>
              <CheckBox
                activeOpacity={0.7}
                checkedColor={COLORS.PRIMARY}
                style={styles.checkBox}
                checked={selected.indexOf(item.value) >= 0}
                onPress={() => {
                  this.onSelect(item.value);
                }}
              />
              <View style={styles.body}>
                <Text style={styles.text}>{item.label}</Text>
              </View>
            </Item>
          ))
        ) : !!data && this.props.mode === 'pick' ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={200}
            decelerationRate="fast"
            pagingEnabled={false}
            horizontal
            style={{
              flex: 1,
            }}
          >
            {data.map((item, i) => (
              <View key={i} style={styles.pick}>
                <TouchableOpacity
                  style={[
                    styles.pickitem,
                    selected.indexOf(item.value) >= 0 && styles.selectedItem,
                  ]}
                  activeOpacity={SIZES.OPACITY}
                  onPress={() => {
                    this.setState({ selected: [item.value] }, () => {
                      if (this.props.onSubmit) {
                        this.props.onSubmit(item.value);
                      }
                    });
                  }}
                >
                  <Text style={styles.picktext}>{item.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          <RadioForm
            radio_props={data}
            initial={
              selected.length > 0
                ? data.findIndex((item) => item.value === selected[0])
                : -1
            }
            formHorizontal={this.props.formHorizontal}
            onPress={(value) => {
              this.setState({ selected: [value] }, () => {
                if (this.props.onSubmit) {
                  this.props.onSubmit(value);
                }
              });
            }}
          />
        )}
      </View>
    );
  }
}

export default withTheme(Choices, '');
