import React, { Component } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Text from '../Text';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { breadthFirstRecursion } from './menutransform';
import EmptyList from './Empty';
import { styles } from './styled';
import { COLORS, SIZES } from '../../theme';
import { t } from '../../loc/i18n';

interface ITreeSelectProps {
  isShowTreeId: boolean;
  selectedItemStyle: any;
  itemStyle: any;
  treeNodeStyle: any;
  defaultSelectedId: string[];
  selectType: string;
  isOpen?: boolean;
  data: any;
  openIds?: string[];
  leafCanBeSelected: boolean;
  onClick(param: any);
  onClickLeaf(param: any);
}

interface ITreeSelectStates {
  nodesStatus: any;
  currentNode?: any;
  searchValue: string;
}

class TreeSelect extends Component<ITreeSelectProps, ITreeSelectStates> {
  private routes: any[];
  constructor(props) {
    super(props);
    this.routes = [];
    this.state = {
      nodesStatus: this._initNodesStatus(),
      currentNode: this._initCurrentNode(),
      searchValue: '',
    };
  }

  _initCurrentNode = () => {
    const { defaultSelectedId, selectType } = this.props;
    if (selectType === 'multiple') {
      return defaultSelectedId || [];
    }
    return (defaultSelectedId && defaultSelectedId[0]) || null;
  };

  _initNodesStatus = () => {
    const {
      isOpen = false,
      data,
      openIds = [],
      defaultSelectedId = [],
    } = this.props;
    const nodesStatus = new Map();
    if (!isOpen) {
      if (openIds && openIds.length) {
        for (let id of openIds) {
          // eslint-disable-line
          const routes = this._find(data, id);
          routes.map((parent) => nodesStatus.set(parent.cid, true));
        }
      }
      // Set the parent node's expand operation when selected by default
      if (defaultSelectedId && defaultSelectedId.length) {
        for (let id of defaultSelectedId) {
          // eslint-disable-line
          const routes = this._find(data, id);
          routes.map((parent) => nodesStatus.set(parent.cid, true));
        }
      }
      return nodesStatus;
    }
    breadthFirstRecursion(data).map((item) => nodesStatus.set(item.cid, true));
    return nodesStatus;
  };

  _find = (data, id) => {
    const stack: any[] = [];
    let going = true;

    const walker = (childrenData, innerId) => {
      childrenData.forEach((item) => {
        if (!going) return;
        stack.push({
          id: item.cid,
          name: item.name,
          parentId: item.parentId,
        });
        if (item['cid'] === innerId) {
          going = false;
        } else if (item['children']) {
          walker(item['children'], innerId);
        } else {
          stack.pop();
        }
      });
      if (going) stack.pop();
    };

    walker(data, id);
    return stack;
  };

  _onPressCollapse = ({ e, item }) => {
    // eslint-disable-line
    const { data, selectType, leafCanBeSelected } = this.props;
    const { currentNode } = this.state;
    const routes = this._find(data, item.cid);
    this.setState(
      (prevState) => {
        const nodesStatus = new Map(prevState.nodesStatus);
        nodesStatus.set(item && item.cid, !nodesStatus.get(item && item.cid)); // toggle
        // Calculate the content of currentNode
        if (selectType === 'multiple') {
          const tempCurrentNode = currentNode.includes(item.cid)
            ? currentNode.filter((nodeid) => nodeid !== item.cid)
            : currentNode.concat(item.cid);
          if (leafCanBeSelected) {
            return { nodesStatus };
          }
          return { currentNode: tempCurrentNode, nodesStatus };
        } else {
          if (leafCanBeSelected) {
            return { nodesStatus };
          }
          return { currentNode: item.cid, nodesStatus };
        }
      },
      () => {
        const { onClick } = this.props;
        onClick &&
          onClick({ item, routes, currentNode: this.state.currentNode });
      }
    );
  };

  _onClickLeaf = ({ e, item }) => {
    // eslint-disable-line
    const { onClickLeaf, onClick, selectType, leafCanBeSelected } = this.props;
    const { data } = this.props;
    const { currentNode } = this.state;
    const routes = this._find(data, item.cid);
    this.setState(
      (state) => {
        // Calculate the content of currentNode
        if (selectType === 'multiple') {
          const tempCurrentNode = currentNode.includes(item.cid)
            ? currentNode.filter((nodeid) => nodeid !== item.cid)
            : currentNode.concat(item.cid);
          return {
            currentNode: tempCurrentNode,
          };
        } else {
          return {
            currentNode: item.cid,
          };
        }
      },
      () => {
        onClick &&
          onClick({ item, routes, currentNode: this.state.currentNode });
        onClickLeaf &&
          onClickLeaf({ item, routes, currentNode: this.state.currentNode });
      }
    );
  };

  _renderTreeNodeIcon = (isOpen) => {
    const {
      isShowTreeId = false,
      selectedItemStyle,
      itemStyle,
      treeNodeStyle,
    } = this.props;
    const collapseIcon = isOpen
      ? {
          borderRightWidth: 5,
          borderRightColor: 'transparent',
          borderLeftWidth: 5,
          borderLeftColor: 'transparent',
          borderTopWidth: 10,
          borderTopColor: COLORS.BORDER,
        }
      : {
          borderBottomWidth: 5,
          borderBottomColor: 'transparent',
          borderTopWidth: 5,
          borderTopColor: 'transparent',
          borderLeftWidth: 10,
          borderLeftColor: COLORS.BORDER,
        };
    const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
    const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

    return openIcon && closeIcon ? (
      <View>{isOpen ? openIcon : closeIcon}</View>
    ) : (
      <View style={[styles.collapseIcon, collapseIcon]} />
    );
  };

  _renderRow = ({ item }) => {
    const { currentNode } = this.state;
    const {
      isShowTreeId = false,
      selectedItemStyle,
      itemStyle,
      treeNodeStyle,
      selectType = 'single',
      leafCanBeSelected,
    } = this.props;
    const { backgroudColor, fontSize, color } = itemStyle && itemStyle;
    const openIcon = treeNodeStyle && treeNodeStyle.openIcon;
    const closeIcon = treeNodeStyle && treeNodeStyle.closeIcon;

    const selectedBackgroudColor =
      selectedItemStyle && selectedItemStyle.backgroudColor;
    const selectedFontSize = selectedItemStyle && selectedItemStyle.fontSize;
    const selectedColor = selectedItemStyle && selectedItemStyle.color;
    const isCurrentNode =
      selectType === 'multiple'
        ? currentNode.includes(item.cid)
        : currentNode === item.cid;

    if (item && item.children && item.children.length) {
      const isOpen =
        (this.state.nodesStatus &&
          this.state.nodesStatus.get(item && item.cid)) ||
        false;
      return (
        <View>
          <TouchableOpacity onPress={(e) => this._onPressCollapse({ e, item })}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor:
                  !leafCanBeSelected && isCurrentNode
                    ? selectedBackgroudColor || COLORS.BACKGROUND_LIGHT
                    : backgroudColor || COLORS.BACKGROUND,
                marginBottom: 2,
                height: 30,
                alignItems: 'center',
              }}
            >
              {this._renderTreeNodeIcon(isOpen)}
              {isShowTreeId && (
                <Text style={{ fontSize: SIZES.H6, marginLeft: 4 }}>
                  {item.cid}
                </Text>
              )}
              <Text
                style={[
                  styles.textName,
                  !leafCanBeSelected && isCurrentNode
                    ? { fontSize: selectedFontSize, color: selectedColor }
                    : { fontSize, color },
                ]}
              >
                {t(item.name, { defaultValue: item.name })}
              </Text>
            </View>
          </TouchableOpacity>
          {!isOpen ? null : (
            <FlatList
              keyExtractor={(childrenItem, i) => i.toString()}
              style={{ flex: 1, marginLeft: 15 }}
              onEndReachedThreshold={0.01}
              {...this.props}
              data={item.children}
              extraData={this.state}
              renderItem={this._renderRow}
            />
          )}
        </View>
      );
    }
    return (
      <TouchableOpacity onPress={(e) => this._onClickLeaf({ e, item })}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isCurrentNode
              ? selectedBackgroudColor || COLORS.BACKGROUND_LIGHT
              : backgroudColor || COLORS.BACKGROUND,
            marginBottom: 2,
            height: 30,
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              styles.textName,
              isCurrentNode
                ? { fontSize: selectedFontSize, color: selectedColor }
                : { fontSize, color },
            ]}
          >
            {t(item.name, { defaultValue: item.name })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _onSearch = () => {
    const { searchValue } = this.state;
  };

  _onChangeText = (value: string) => {
    this.setState({
      searchValue: value,
    });
  };

  _renderSearchBar = () => {
    const { searchValue } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: COLORS.BORDER,
          marginHorizontal: 10,
        }}
      >
        <TextInput
          style={{ height: 38, paddingHorizontal: SIZES.PADDING_HALF, flex: 1 }}
          value={searchValue}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          autoCorrect={false}
          blurOnSubmit
          clearButtonMode="while-editing"
          placeholder={t('Search')}
          placeholderTextColor={COLORS.PLACEHOLDER}
          onChangeText={(text) => this._onChangeText(text)}
        />
        <TouchableOpacity onPress={this._onSearch}>
          <Icon
            name="magnifier"
            style={{ fontSize: SIZES.ICON_LARGE, marginHorizontal: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {/*
          this._renderSearchBar()
         // */}
        <FlatList
          keyExtractor={(item, i) => i.toString()}
          style={{
            flex: 1,
            marginVertical: 5,
            paddingHorizontal: SIZES.PADDING,
          }}
          onEndReachedThreshold={0.01}
          {...this.props}
          data={data}
          ListEmptyComponent={
            <EmptyList icon={'org'} text={t('No category')} />
          }
          extraData={this.state}
          renderItem={this._renderRow}
        />
      </View>
    );
  }
}

export default TreeSelect;
