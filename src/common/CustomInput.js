import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { blackColor, grayColor, greenColor, whiteColor } from './Color'; 
import Customicons from './Customicons';

const CustomInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false, 
  iconName, 
  keyboardType = 'default', 
  style = {} 
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
        <Customicons 
          name={iconName} 
          size={25} 
          color={grayColor} 
          style={styles.icon} 
        />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#999" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    height: 50, 
    backgroundColor: whiteColor, 
  },
  icon: {
    marginRight: 10, 
  },
  input: {
    flex: 1,
    fontSize: 16, 
    color: blackColor, 
  },
});

export default CustomInput;
