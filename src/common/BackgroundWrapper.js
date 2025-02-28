import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const BackgroundWrapper = ({ backgroundImage }) => {
  return (
   
      <Image source={backgroundImage} style={styles.backgroundImage} />
      
 
  );
};

const styles = StyleSheet.create({
  
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
    opacity: 0.7,
  },
});

export default BackgroundWrapper;
