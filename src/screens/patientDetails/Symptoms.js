import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign'; 
const Symptoms = () => {
  const symptomData = [
    {
      id: 1,
      imageUrl: 'https://beta.hru.today/patient/673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image',
      texts: ['Symptoms 1', 'Symptoms 2', 'Symptoms 3', 'Symptoms 4'],
    },
    {
      id: 2,
      imageUrl: 'https://beta.hru.today/patient/673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image',
      texts: ['Symptoms 1', 'Symptoms 2', 'Symptoms 3', 'Symptoms 4'],
    },
    {
      id: 3,
      imageUrl: 'https://beta.hru.today/patient/673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image',
      texts: ['Symptoms 1', 'Symptoms 2', 'Symptoms 3', 'Symptoms 4'],
    },
    {
      id: 4,
      imageUrl: 'https://beta.hru.today/patient/673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image',
      texts: ['Symptoms 1', 'Symptoms 2', 'Symptoms 3', 'Symptoms 4'],
    },
  ];

  return (
    <FlatList
      data={symptomData}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
         
          <Image source={{ uri: item.imageUrl }} style={styles.image} />

     
          <View style={styles.textContainer}>
            {item.texts.map((text, index) => (
              <Text key={index} style={styles.text}>
                {text}
              </Text>
            ))}
          </View>

       
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="download" size={28} color="#007BFF" />
          </TouchableOpacity>
        </View>
      )}
      showsVerticalScrollIndicator={false} 
    />
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  iconContainer: {
    padding: 8,
  },
});
