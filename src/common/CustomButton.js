import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { blackColor, fontFamily, grayColor, greenColor, whiteColor } from './Color';

const CustomButton = ({ 
  title, 
  onPress, 
  style = {}, 
  textStyle = {}, 
  color = greenColor 
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, 
    marginVertical: 10, 
    shadowColor: blackColor, 
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    width:'100%'
  },
  buttonText: {
    color: whiteColor, 
    fontSize: 16,
    alignItems: 'center',
    justifyContent:"center",
    fontFamily: fontFamily,
    textAlign:"center"
  },
});

export default CustomButton;
