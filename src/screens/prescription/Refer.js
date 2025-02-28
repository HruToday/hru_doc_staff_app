import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppContext } from '../../context _api/Context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../common/CustomButton';
import { greenColor } from '../../common/Color';
import { saveprescriptiondetailspreviewjson } from '../../api/authService';

// Moving InputField outside of the Refer function
const InputField = ({ label, value, onChangeText, ...props }) => {
  return (
    <View style={styles.input_group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );
};

const Refer = ({ route }) => {
  const appointmentId = route?.params?.appointmentId;

  const navigation = useNavigation();
  const [specialist_name, setSpecialistName] = useState('');
  const [clinic_hospital, setClinicHospital] = useState('');
  const [notes, setNotes] = useState('');

  const { item,userdata,digital_id,digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);
  const token = userdata?.data?.auth_token;
 
  useEffect(() => {
     if (digital_Prescription[appointmentId]) {
      
       setSpecialistName(item.specialistName || '')
       setClinicHospital(item.clinicHospital || "")
       setNotes(item.notes || '') 
   
       Digtail_PrescriptionData(appointmentId, "referdata", { 
        specialistName:specialist_name,
        clinicHospital:clinic_hospital,
        notes,
       });
     }
   }, [appointmentId]);
    useEffect(() => {
       if (digital_Prescription[appointmentId]?.referdata) {
        setSpecialistName(digital_Prescription[appointmentId]?.referdata.specialistName|| '');
        setClinicHospital(digital_Prescription[appointmentId]?.referdata.clinicHospital || '');
        setNotes(digital_Prescription[appointmentId]?.referdata.notes || '');
       }
     }, [appointmentId]);

  
  const handleSpecialistChange = useCallback((value) => {
    if (value !== specialist_name) {
      setSpecialistName(value);
    }
  }, [specialist_name]);

  const handleClinicChange = useCallback((value) => {
    if (value !== clinic_hospital) {
      setClinicHospital(value);
    }
  }, [clinic_hospital]);

  const handleNotesChange = useCallback((value) => {
    if (value !== notes) {
      setNotes(value);
    }
  }, [notes]);


  useEffect(() => {
    const referData = {
      specialistName:specialist_name,
      clinicHospital:clinic_hospital,
      notes,
    };

   
    if (specialist_name || clinic_hospital || notes) {
      Digtail_PrescriptionData(appointmentId, 'referdata', referData);
    }
  }, [specialist_name, clinic_hospital, notes,appointmentId]);
 
  return (
    <View style={styles.container}>
      {/* Input Fields */}
      <InputField
        label="Specialist Name"
        value={specialist_name}
        onChangeText={handleSpecialistChange}
      />
      <InputField
        label="Clinic / Hospital"
        value={clinic_hospital}
        onChangeText={handleClinicChange}
      />
      <InputField
        label="Notes"
        value={notes}
        onChangeText={handleNotesChange}
      />

      <View style={styles.buttonsContainer}>
        <CustomButton
          style={styles.leftButton}
          onPress={() => navigation.navigate('FollowUp', { appointmentId: appointmentId  })}
          title={'← Follow Up'}
        />
        <CustomButton
          style={styles.rightButton}
          title={'Next →'}
          onPress={()=>{ navigation.navigate('Prescriptions', {  appointmentId: appointmentId,  });}}
        />
      </View>
    </View>
  );
};

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
  input_group: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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

export default Refer;
