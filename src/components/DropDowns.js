import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppContext } from '../context _api/Context';

const DropDowns = () => {
  const { refreshPage, selectedClinic,
    selectedDoctor,
    selectclinic,
    selectdocotrs,userdata } = useContext(AppContext);
  
  const doctors = userdata?.data?.doctors || [];
 const clinics = userdata?.data?.addresses || [];



  return (
    <View style={styles.container}>
      <View style={styles.dropdown_container}>
        {/* Doctor Dropdown */}
        <View style={styles.dropdown_section}>
          <Text style={styles.label}>Select Doctor</Text>
          <View style={styles.dropdown_wrapper}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(itemValue) => {refreshPage(true),selectdocotrs(itemValue)}}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              {doctors.map((doctor) => (
                <Picker.Item key={doctor._id} label={doctor.doctorName} value={doctor._id} />
              ))}
            </Picker>
            <MaterialCommunityIcons name="chevron-down" size={20} style={styles.dropdown_icon} />
          </View>
        </View>

        {/* Clinic Dropdown */}
        <View style={styles.dropdown_section}>
          <Text style={styles.label}>Select Clinic</Text>
          <View style={styles.dropdown_wrapper}>
            <Picker
              selectedValue={selectedClinic}
              onValueChange={(itemValue) => {refreshPage(true),selectclinic(itemValue)}}
              style={styles.picker}
            >
              <Picker.Item label="All" value="" />
              {clinics.map((clinic) => (
                <Picker.Item key={clinic.id} label={clinic.workLocation} value={clinic.id} />
              ))}
            </Picker>
            <MaterialCommunityIcons name="chevron-down" size={20} style={styles.dropdown_icon} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default DropDowns;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: 'white',
  },
  dropdown_container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dropdown_section: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'black',
    marginBottom: 4,
  },
  dropdown_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    width: 150,
    height: 50,
    borderColor: 'lightgray',
    overflow: 'hidden',
    paddingHorizontal: 8,
  },
  picker: {
    flex: 1,
    color: '#000',
    height: 50,
  },
  dropdown_icon: {
    position: 'absolute',
    right: 10,
    color: 'gray',
  },
});
