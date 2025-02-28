import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, Picker } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MedicationModal = ({ visible, onClose, onSave }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dose, setDose] = useState('');
  const [quantity, setQuantity] = useState('');
  const [duration, setDuration] = useState('');
  const [time, setTime] = useState(new Date());
  const [timeContext, setTimeContext] = useState('After Meal'); // Default value
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    const medicationDetails = {
      medicineName,
      dose,
      quantity,
      duration,
      time,
      timeContext,
    };
    onSave(medicationDetails);
    clearFields();
    onClose();
  };

  const clearFields = () => {
    setMedicineName('');
    setDose('');
    setQuantity('');
    setDuration('');
    setTime(new Date());
    setTimeContext('After Meal');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add Medication</Text>

          <TextInput
            style={styles.input}
            placeholder="Medicine Name"
            value={medicineName}
            onChangeText={setMedicineName}
          />

          <TextInput
            style={styles.input}
            placeholder="Dose (e.g., 500mg)"
            value={dose}
            onChangeText={setDose}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Duration (e.g., 5 days)"
            value={duration}
            onChangeText={setDuration}
          />

          <View style={styles.timePickerContainer}>
            <Text style={styles.label}>Time:</Text>
            <Button title="Select Time" onPress={() => setShowTimePicker(true)} />
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}

          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Time Context:</Text>
            {/* <Picker
              selectedValue={timeContext}
              style={styles.picker}
              onValueChange={(itemValue) => setTimeContext(itemValue)}
            >
              <Picker.Item label="After Meal" value="After Meal" />
              <Picker.Item label="Before Meal" value="Before Meal" />
              <Picker.Item label="Empty Stomach" value="Empty Stomach" />
              <Picker.Item label="Before Sleep" value="Before Sleep" />
            </Picker> */}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} color="red" />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  dropdownContainer: {
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default MedicationModal;
