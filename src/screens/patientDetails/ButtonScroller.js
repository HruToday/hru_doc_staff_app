import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { grayColor, greenColor, whiteColor } from '../../common/Color';

const ButtonScroller = ({
    scrollview,
  buttons,
  selectedButton,
  onButtonPress,
  buttonStyle,
  selectedButtonStyle,
  buttonTextStyle,
  selectedButtonTextStyle,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      
      style={[styles.scrollContainer,scrollview]}
    >
      <View style={styles.buttonRow}>
        {buttons.map(button => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.button,
              buttonStyle,
              selectedButton === button.title && [styles.selectedButton, selectedButtonStyle],
            ]}
            onPress={() => onButtonPress(button.title)}
          >
            <Text
              style={[
                styles.buttonText,
                buttonTextStyle,
                selectedButton === button.title && [styles.selectedButtonText, selectedButtonTextStyle],
              ]}
            >
              {button.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop:5,
    //  marginBottom: 20,
    // backgroundColor: greenColor,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
  },
  button: {
    backgroundColor: whiteColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: greenColor,
    fontSize: 12,
   
  },
  selectedButtonText: {
    color: grayColor, 
  },
});

export default ButtonScroller;
