import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { greenColor } from '../../common/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importing DateTimePicker
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context _api/Context';

const LMP = ({route}) => {
    const appointmentId = route?.params?.appointmentId;

    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [selectedDate, setSelectedDate] = useState(''); 
 const { item,digital_Prescription, Digtail_PrescriptionData, } = useContext(AppContext);
   useEffect(() => {
      if (digital_Prescription[appointmentId]?.lmp) {
        setSelectedDate(digital_Prescription[appointmentId]?.lmp);
      }
    }, [appointmentId, digital_Prescription]);
  
    useEffect(() => {
      if (selectedDate) {
        
        Digtail_PrescriptionData(appointmentId, 'lmp', selectedDate);
      }
    }, [selectedDate]);
   
    const onDateChange = (event, date) => {
        setShowDatePicker(false); 
        if (date) {
            const formattedDate = date.toLocaleDateString('en-GB'); // Format date as dd/mm/yyyy
            setSelectedDate(formattedDate); 
        }
    };

    return (
        <View style={styles.container}>
            <Text>First Day of Last Menstrual Period</Text>
            
            {/* Date Input Row */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <TextInput
                    style={styles.dateTextInput}
                    placeholder="dd/mm/yy"
                    placeholderTextColor={greenColor}
                    value={selectedDate} // Show selected date
                    editable={false} // Prevent manual editing
                />
              
                    <Icon name="calendar" size={25} color={greenColor} />
               
            </TouchableOpacity>

            {/* Date Picker Modal */}
            {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    value={new Date()} // Default date
                    onChange={onDateChange}
                />
            )}

            <View style={styles.buttonsContainer}>
                <CustomButton
                    style={styles.leftButton}
                    onPress={() => navigation.navigate('Vitals', { appointmentId: appointmentId})}
                    title={'← Vitals'}
                />
                <CustomButton
                    style={styles.rightButton}
                    title={'Complaints →'}
                    onPress={() => navigation.navigate('Complaints',{appointmentId: appointmentId })}
                />
            </View>
        </View>
    );
};

export default LMP;

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
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: greenColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        width: 150
    },
    dateTextInput: {
        flex: 2, // Keeps the input in the center
        textAlign: 'center',
        fontSize: 14,
        color: greenColor,
        width: '90%'
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
