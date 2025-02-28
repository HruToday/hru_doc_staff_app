import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { grayColor, greenColor } from '../common/Color';
const PatientDetails_dropdown = ({data, onSelect, placeholder, style}) => {
  return (
    <LinearGradient
      colors={['white', '#d0ece7']}
      style={styles.gradient}
      start={{x: 0, y: 0}}
      end={{x: 3, y: 1}}>
      <View style={[styles.dropdown, style]}>
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => onSelect(item)}>
              <View style={styles.itemContent}>
                {/* Left Side: Name and Mobile Number */}
                <View style={styles.textContainer}>
                  <Text style={styles.dropdownText}>{item.label}</Text>
                  {item.mobile_no && (
                    <Text style={styles.mobileText}>{item.mobile_no}</Text>
                  )}{' '}
                  {/* Mobile Number */}
                </View>

                {/* Right Side: Image */}
                {item.profile_pic ? (
                  <Image
                    source={{uri: item.profile_pic}}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}></Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Ensures the gradient covers the entire screen
  },
  dropdown: {
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
  },
  dropdownText: {
   fontSize: 16,
       fontWeight: 'bold',
       color: grayColor,
  },
  mobileText: {
     fontSize: 14,
        color: greenColor,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // makes the image round
    marginLeft: 10,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  noDataText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    padding: 10,
  },
});

export default PatientDetails_dropdown;
