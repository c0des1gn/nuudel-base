import React, { FC, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import MultiSelect, { MultiSelectProps } from 'react-native-multiple-select';
import { styles } from './styled';
import { COLORS, SIZES } from '../../theme';
import { t } from '../../loc/i18n';

//extends MultiSelectProps
export interface IMultiSelectProps {
  items: any[];
  selectedItems: any[];
  disabled: boolean;
  onChangeInput?(val: any);
  valueChanged(val: any);
}

export const MultiSelectField: FC<IMultiSelectProps> = ({ ...props }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    props.valueChanged(selectedItems);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.multiSelectContainer}>
        <MultiSelect
          items={props.items}
          styleTextDropdown={styles.multichoice}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          textInputProps={{
            editable: props.disabled,
            autoFocus: props.disabled,
          }}
          selectText={t('PickItems')}
          searchInputPlaceholderText={t('SearchItems')}
          onChangeInput={(text) => props.onChangeInput!(text)}
          tagRemoveIconColor={COLORS.ICON_LIGHT}
          tagBorderColor={COLORS.BORDER}
          tagTextColor={COLORS.TEXT_LIGHT}
          selectedItemTextColor={COLORS.TEXT}
          selectedItemIconColor={COLORS.ICON}
          itemTextColor={COLORS.TEXT_DARK}
          displayKey="name"
          searchInputStyle={{ color: COLORS.INPUT }}
          submitButtonColor={COLORS.BUTTON}
          submitButtonText={t('Submit')}
        />
      </View>
    </SafeAreaView>
  );
};

export default MultiSelectField;
