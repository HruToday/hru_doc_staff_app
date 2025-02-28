import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressSearch = () => {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  return (
    <View style={{ flex: 1}}>
      <GooglePlacesAutocomplete
      
        placeholder="Search for a place"
        value={address}
        onChangeText={(text) => setAddress(text)}
        fetchDetails={true}
        onPress={(data, details = null) => {
          setAddress(data.description);
          if (details && details.geometry && details.geometry.location) {
            setLatitude(details.geometry.location.lat);
            setLongitude(details.geometry.location.lng);
          }
        }}
        query={{
          key: 'AIzaSyCJbnxIUqkQQE99IB4Ffg90k4cQ6wcf068', // Use your actual API key
          language: 'en',
        }}
        styles={{
          textInput: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            fontSize: 14,
            height: 45,
          },
          listView: {
            backgroundColor: 'white',
            zIndex: 1, // Ensure the dropdown is above other elements
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
      
    </View>
  );
};

export default AddressSearch;
