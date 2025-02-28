import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { greenColor } from '../common/Color';

const CustomTag = ({ data, selectedItems, onSelectionChange }) => {
  const handleSelect = (item) => {
    if (!selectedItems.some((selected) => selected.product_name === item.product_name)) {
      onSelectionChange([...selectedItems, item]);
    }
  };
  
  return (
    <View style={styles.custom_component}>
      <View style={styles.items_container}>
        {data.map((item, index) => {
          const isSelected = selectedItems.some((selected) => selected.product_name === item.product_name);
          return (
            <View
              style={[
                styles.item_container,
                isSelected && styles.item_container_selected,
              ]}
              key={index}
            >
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text
                  style={[
                    styles.custom_component_item,
                    isSelected && styles.custom_component_item_selected,
                  ]}
                >
                  {item.product_name}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
  
};

export default CustomTag;

const styles = StyleSheet.create({
  custom_component: {
    padding: 10,
  },
  items_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 5,
  },
  item_container: {
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
  },
  item_container_selected: {
    backgroundColor: greenColor,
    borderColor: greenColor,
  },
  custom_component_item: {
    fontSize: 10,
    color: 'black',
  },
  custom_component_item_selected: {
    color: 'white',
  },
});
