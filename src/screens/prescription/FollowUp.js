import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { greenColor } from '../../common/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context _api/Context';

const FollowUp = ({ route }) => {
    const appointmentId = route?.params?.appointmentId;
  
    const navigation = useNavigation();
    const { item,digital_id, digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);

    // Get initial values from context
    const followUp = digital_Prescription[appointmentId]?.followup || {};

    const [textinputValue, setTextinputValue] = useState(followUp.text || digital_id.followupDays);
    const [selectedDosage, setSelectedDosage] = useState(followUp.dosage || 'Day');
    const [selectedDate, setSelectedDate] = useState(followUp.date || false);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const Duration = ['Day', 'Week', 'Month'];

   useEffect(() => {
       if (digital_Prescription[appointmentId]?.followup) {
        setTextinputValue(digital_Prescription[appointmentId]?.followup.text||'' );
        setSelectedDosage(digital_Prescription[appointmentId]?.followup.dosage || []);
        setSelectedDate(digital_Prescription[appointmentId]?.followup.date || false);
       }
     }, [appointmentId]);
    useEffect(() => {
        Digtail_PrescriptionData(appointmentId, 'followup', {
            text: textinputValue,
            dosage: selectedDosage,
            date: selectedDate,
        });

    }, [textinputValue, selectedDosage, selectedDate]);

    const onDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const formattedDate = date.toLocaleDateString();
            setSelectedDate(formattedDate);
            setTextinputValue('');  // Clear input field
            setSelectedDosage('');
        }
    };
    const handleTextInputChange = (text) => {
        setTextinputValue(text);
        setSelectedDate(false); 
    };

    // Handle dosage selection
    const handleDosageSelection = (dosage) => {
        setSelectedDosage(dosage);
        setSelectedDate(false); 
    };

    
    
    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 10 }}>Select follow-up days:</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    value={textinputValue}
                    onChangeText={handleTextInputChange}
                    keyboardType="numeric"
                />
                <ScrollView horizontal contentContainerStyle={styles.button_row} showsHorizontalScrollIndicator={false}>
                    {Duration.map((dosage, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, selectedDosage === dosage ? styles.selected_button : null]}
                            onPress={() => handleDosageSelection(dosage)}
                        >
                            <Text style={[styles.button_text, selectedDosage === dosage ? styles.selected_button_text : null]}>
                                {dosage}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <Text style={{ marginTop: 10 }}>OR</Text>
            <View style={styles.dateInput}>
                <TextInput
                    style={styles.dateTextInput}
                    placeholder="dd/mm/yy"
                    placeholderTextColor={greenColor}
                    value={selectedDate}
                    editable={false}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Icon name="calendar" size={25} color={greenColor} />
                </TouchableOpacity>
            </View>
            {showDatePicker && <DateTimePicker mode="date" value={new Date()} onChange={onDateChange} />}

            <View style={styles.buttonsContainer}>
                <CustomButton
                    style={styles.leftButton}
                    onPress={() => navigation.navigate('Diet', { appointmentId: appointmentId,})}
                    title={'← Diet'}
                />
                <CustomButton
                    style={styles.rightButton}
                    title={'Refer →'}
                    onPress={() => navigation.navigate('Refer', { appointmentId: appointmentId,  })}
                />
            </View>
        </View>
    );
};

export default FollowUp;




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
    input: {
        height: 38,
        width: 60,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button_row: {
        flexDirection: 'row',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
        borderColor: greenColor,
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    button_text: {
        color: 'black',
        fontSize: 12,
    },
    selected_button: {
        backgroundColor: greenColor, // Selected button background
    },
    selected_button_text: {
        color: '#fff', // Selected button text color
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        width: 150,
    },
    dateTextInput: {
        flex: 2, // Keeps the input in the center
        textAlign: 'center',
        fontSize: 14,
        color: greenColor,
        width: '90%',
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
