import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { blackColor, grayColor, greenColor, whiteColor } from '../common/Color';
import LocationDropdown from './LocationDropdown';

const SecondHeader = ({
  title,
  onSearch,
  showSearch = true,
  topBarStyle = {},
  showLocationDropdown = true,
  titlecss = {}
}) => {
  const navigation = useNavigation(); // Initialize the navigation object

  const handleBackPress = () => {
    navigation.goBack(); // Navigate back when the back arrow is clicked
  };

  return (
    <View style={styles.headerContainer}>
      <View style={[styles.topBar, topBarStyle]}>
        {/* <TouchableOpacity onPress={handleBackPress}> 
          <MaterialIcons name="arrow-back" size={24} color={whiteColor} />
        </TouchableOpacity> */}
        <Text style={[styles.title, titlecss]}>{title}</Text>
        {showSearch && (
        <TextInput
          style={styles.searchBox}
          placeholder="Search Patient by name or mobile no."
          onChangeText={onSearch}
          placeholderTextColor={"gray"}
        />
      )}

       
        {/* {showLocationDropdown && <LocationDropdown />} */}
      </View>
      
    </View>
  );
};

export default SecondHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: greenColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    color: whiteColor,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    marginLeft: 5,
    fontSize: 14,
    color: whiteColor,
  },
  searchBox: {
    width:250,
    height: 50,
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 10,
    marginRight:10,
    // paddingHorizontal: 10,
    fontSize: 14,
    color: blackColor,
    backgroundColor: whiteColor,
  },
});
