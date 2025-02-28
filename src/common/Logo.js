import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { grayColor, greenColor, whiteColor } from './Color';

const Logo = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    // flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  logoContainer: {
    width: 150, 
    height: 150, 
    borderRadius: 75,
    overflow: 'hidden', 
    borderWidth: 2,
    borderColor: greenColor,
    // shadowColor: whiteColor,
    // shadowOffset: { width: 10, height: 2 }, 
    // shadowOpacity: 1, 
    // shadowRadius: 5,
    // elevation: 5, 
    // justifyContent: 'center',
    // alignItems: 'center', 
    marginBottom: 20, 
  },
  logo: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain', 
  },
});
