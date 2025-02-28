import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { greenColor } from '../../common/Color';
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context _api/Context';

const Advice = ({ route }) => {
  const appointmentId = route?.params?.appointmentId;
 
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addedValues, setAddedValues] = useState([]);
  const {item, digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);

  const prevAddedValuesRef = useRef();

 

  // Initialize data from item or context
  useEffect(() => {
    if (digital_Prescription[appointmentId]) {
     
      Digtail_PrescriptionData(appointmentId, 'advice', item.advice || []);
    }
  }, [appointmentId]);

  // Load advice from context when available
  useEffect(() => {
    if (digital_Prescription[appointmentId]?.advice) {
      setAddedValues([...digital_Prescription[appointmentId].advice]);
    }
  }, [digital_Prescription, appointmentId]);

  // Sync local state with global context
  useEffect(() => {
    if (
      prevAddedValuesRef.current &&
      JSON.stringify(prevAddedValuesRef.current) !== JSON.stringify(addedValues)
    ) {
     
      Digtail_PrescriptionData(appointmentId, 'advice', addedValues);
    }
    prevAddedValuesRef.current = addedValues;
  }, [addedValues, appointmentId]);

  const handleInputChange = (text) => {
    setInputValue(text);
    setDropdownVisible(true);
  };

  const handleAddValue = () => {
    if (inputValue.trim() && !addedValues.includes(inputValue.trim())) {
      setAddedValues((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
      setDropdownVisible(false);
    }
  };

  const handleRemoveValue = (value) => {
    setAddedValues((prev) => prev.filter((item) => item !== value));
  };

  return (
    <View style={styles.container}>
      <View style={styles.input_container}>
        <View style={styles.input_box_with_tags}>
          {addedValues.map((value, index) => (
            <View key={index} style={styles.inlineTag}>
              <Text style={styles.inlineTagText}>{value}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveValue(value)}
                style={styles.unselect_button}
              >
                <Text style={styles.unselect_button_text}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleInputChange}
            placeholderTextColor={greenColor}
            placeholder="Advice"
          />
        </View>

        {dropdownVisible && inputValue.length > 0 && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleAddValue} style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Add "{inputValue}"</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <CustomButton
            style={styles.leftButton}
            onPress={() => navigation.navigate('lab_test', { appointmentId })}
            title={'← Lab Test'}
          />
          <CustomButton
            style={styles.rightButton}
            onPress={() => navigation.navigate('Diet', { appointmentId})}
            title={'Diet →'}
          />
        </View>
      </View>
    </View>
  );
};



export default Advice;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input_container: {
    flex: 1,
    marginBottom: 16,
  },
  input_box_with_tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
  },
  inlineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  inlineTagText: {
    fontSize: 14,
    color: '#00796b',
  },
  unselect_button: {
    marginLeft: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselect_button_text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 10,
  },
  dropdownItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftButton: {
    backgroundColor: '#145d89',
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  rightButton: {
    backgroundColor: greenColor,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
});
