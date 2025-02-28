import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const DynamicImageSlider = ({ images, sliderHeight, containerStyle, onImagePress, autoScrollInterval = 2000, margin = 10 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Function to move to the next image in the slider
  const moveToNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;  // Loop back to first image after the last one
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
  };

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(moveToNext, autoScrollInterval);  // Auto-scroll every "autoScrollInterval" milliseconds
    return () => clearInterval(interval);  // Cleanup the interval on unmount
  }, [currentIndex, autoScrollInterval]);

  // Render each image in the slider
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onImagePress(item)}>
      <View style={{ ...styles.sliderItem, height: sliderHeight, width: screenWidth - 2 * margin, margin }}>
        <Image source={{ uri: item }} style={{ ...styles.image, height: sliderHeight, width: '100%' }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth - 2 * margin}  // Adjust snap to include margin
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: margin }}  // Add horizontal padding for margins
        extraData={currentIndex}  // To re-render the FlatList when the current index changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden', // Ensures the image fits within the rounded corners
  },
  image: {
    resizeMode: 'cover',
    borderRadius: 20,
  },
});

export default DynamicImageSlider;
