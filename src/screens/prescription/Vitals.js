import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import SecondHeader from '../../components/SecondHeader';
import {
  fontFamily,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';
import CustomButton from '../../common/CustomButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context _api/Context';

const InputField = ({ label, value, onChangeText, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        maxLength={10}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

const Vitals = ({ navigation, route }) => {
  const appointmentId = route?.params?.appointmentId;


  const [bloodSugar, setBloodSugar] = useState('');
  const [notes, setNotes] = useState('');
  const {
    item,
    gendertoggle,
    digital_Prescription,
    Digtail_PrescriptionData,
  } = useContext(AppContext);


  useEffect(() => {
    const weight = digital_Prescription[appointmentId]?.weight || '';
    const height = digital_Prescription[appointmentId]?.height || '';

    if (weight && height) {
      const calculatedBmi = calculateBMI(weight, height);
      Digtail_PrescriptionData(appointmentId, 'bmi', calculatedBmi);
    }
  }, [digital_Prescription[appointmentId]?.weight, digital_Prescription[appointmentId]?.height]);

  useEffect(() => {
    if (!digital_Prescription[appointmentId]) {
      Digtail_PrescriptionData(appointmentId, 'weight', item.vital?.weight || '');
      Digtail_PrescriptionData(appointmentId, 'height', item.vital?.height || '');
      Digtail_PrescriptionData(appointmentId, 'bpSystolic', item.vital?.bpSystolic || '');
      Digtail_PrescriptionData(appointmentId, 'bpDiastolic', item.vital?.bpDiastolic || '');
      Digtail_PrescriptionData(appointmentId, 'pulse', item.vital?.pulse || '');
      Digtail_PrescriptionData(appointmentId, 'spo2', item.vital?.respiration || '');
      Digtail_PrescriptionData(appointmentId, 'bodyTemp', item.vital?.bodyTemp || '');
      Digtail_PrescriptionData(appointmentId, 'bmi', item.vital?.bmi || '');
      Digtail_PrescriptionData(appointmentId, 'bmiStatus', item.vital?.bmiStatus || '');
      Digtail_PrescriptionData(appointmentId, 'sugarLevel', item.vital?.sugarLevel || '');
      Digtail_PrescriptionData(appointmentId, 'bloodSugar', item.vital?.bloodSugarTest || '');
      Digtail_PrescriptionData(appointmentId, 'otherNote', item.otherNote || '');
    }
  }, [appointmentId]);

  useEffect(() => {
    setBloodSugar(digital_Prescription[appointmentId]?.bloodSugar || item.vital?.bloodSugarTest || '');
    setNotes(digital_Prescription[appointmentId]?.otherNote || item.vital?.otherNote || '');
  }, [appointmentId]);

  useEffect(() => {
 
    if (bloodSugar) {
      Digtail_PrescriptionData(appointmentId, 'bloodSugar', bloodSugar);
    }
    if (notes) {
      Digtail_PrescriptionData(appointmentId, 'otherNote', notes);
    }
  }, [bloodSugar, notes]);

  function calculateBMI(weight, height) {
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return '';
  }
  const handleNavigation = () => {
    if (gendertoggle === "FEMALE") {
     
      navigation.navigate('lmp', { appointmentId: appointmentId} );
    } else {
      navigation.navigate('Complaints', { appointmentId: appointmentId });

     
    }
  };

 

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={{ marginTop: 10 }}>
          {/* Row 1 */}
          <View style={[styles.row, { marginTop: 5 }]}>
            <InputField
              label="Weight (Kg)"
              value={String(digital_Prescription[appointmentId]?.weight || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'weight', value)
              }
              keyboardType="numeric"
            />
            <InputField
              label="Height (Cms)"
              value={String(digital_Prescription[appointmentId]?.height || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'height', value)
              }
              keyboardType="numeric"
            />
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <InputField
              label="BP Systolic (mmHg)"
              value={String(digital_Prescription[appointmentId]?.bpSystolic || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'bpSystolic', value)
              }
              keyboardType="numeric"
            />
            <InputField
              label="BP Diastolic (mmHg)"
              value={String(digital_Prescription[appointmentId]?.bpDiastolic || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'bpDiastolic', value)
              }
              keyboardType="numeric"
            />
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <InputField
              label="Pulse (per/min)"
              value={String(digital_Prescription[appointmentId]?.pulse || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'pulse', value)
              }
              keyboardType="numeric"
            />
            <InputField
              label="SPO2 (%)"
              value={String(digital_Prescription[appointmentId]?.spo2 || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'spo2', value)
              }
              keyboardType="numeric"
            />

          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <InputField
              label="Body Temp. (F/C)"
              value={digital_Prescription[appointmentId]?.bodyTemp || ''}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'bodyTemp', value)
              }
            />
            <InputField
              label="BMI (Kg/m^2)"
              value={String(digital_Prescription[appointmentId]?.bmi || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'bmi', value)
              }
              keyboardType="numeric"
            />

          </View>

          {/* Row 5 */}
          <View style={styles.row}>
            <InputField
              label="BMI Status"
              value={digital_Prescription[appointmentId]?.bmiStatus || ''}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'bmiStatus', value)
              }
            />
            <View style={styles.pickerstyle}>
              <Text style={styles.label}>Blood Sugar Test</Text>
              <Picker
                selectedValue={bloodSugar}
                onValueChange={itemValue => setBloodSugar(itemValue)}
                style={styles.picker}>
                <Picker.Item label="---Select---" value="" />
                <Picker.Item label="Fasting" value="Fasting" />
                <Picker.Item label="PP" value="PP" />
                <Picker.Item label="Random" value="Random" />
              </Picker>
            </View>
          </View>

          {/* Row 6 */}
          <View style={styles.row}>
            <InputField
              label="Sugar Level"
              value={String(digital_Prescription[appointmentId]?.sugarLevel || '')}
              onChangeText={value =>
                Digtail_PrescriptionData(appointmentId, 'sugarLevel', value)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={styles.notesWrapper}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Enter notes here..."
              multiline
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.buttonsContainer}>
            <CustomButton
              style={styles.leftButton}
              onPress={() => navigation.navigate('Prescriptions', { appointmentId: appointmentId ,item})}
              title={'← Preview'}
            />
            <CustomButton
              style={styles.rightButton}
              title={gendertoggle === "FEMALE" ? "LMP →" : "Complaints →"}
              onPress={handleNavigation}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default Vitals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: whiteColor,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    margin: 10,
  },
  notesWrapper: {
    marginBottom: 20,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerstyle: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 10,
    width: '49%',
    height: 45,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 10,
    color: greenColor,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  buttonsContainer: {
    position: 'relative',


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


