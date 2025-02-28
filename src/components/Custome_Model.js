import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown menu
import { greenColor, whiteColor } from '../common/Color';

const Custome_Model = ({ visible, onClose }) => {
  const [selectedValue, setSelectedValue] = useState('');

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            {/* First Row: Icon and Text */}
            <View style={styles.rowContainer}>
              <FontAwesome name="info-circle" size={20} color="#4caf50" style={styles.icon} />
              <Text style={styles.rowText}>Medication Details</Text>
            </View>

            {/* Four Items: Row-wise with border */}
            <View style={styles.itemsContainer}>
              <View style={styles.itemBox}><Text style={styles.itemText}>Item 1</Text></View>
              <View style={styles.itemBox}><Text style={styles.itemText}>Item 2</Text></View>
              <View style={styles.itemBox}><Text style={styles.itemText}>Item 3</Text></View>
              <View style={styles.itemBox}><Text style={styles.itemText}>Item 4</Text></View>
            </View>

            {/* Second Row: Icon and Text */}
            <View style={[styles.rowContainer, { marginTop: 20 }]}>
              <FontAwesome name="list" size={20} color="#4caf50" style={styles.icon} />
              <Text style={styles.rowText}>Select Medication Type</Text>
            </View>

            {/* Dropdown Menu */}
            {/* <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Type 1" value="type1" />
                <Picker.Item label="Type 2" value="type2" />
                <Picker.Item label="Type 3" value="type3" />
              </Picker>
            </View> */}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Custome_Model;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: whiteColor,
    borderRadius: 10,
    padding: 20,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContent: {
    marginTop: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  rowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: greenColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: whiteColor,
    fontSize: 16,
    fontWeight: '500',
  },
});
