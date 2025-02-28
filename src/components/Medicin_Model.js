import React, { useState, useEffect } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { greenColor, whiteColor } from '../common/Color';
import { Picker } from '@react-native-picker/picker';

const Medicin_Model = ({
    visible,
    onClose,
    saveData,
    selectedProductName,
    selectedMedication,
}) => {
    // State for managing the form fields
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [selectedDosage, setSelectedDosage] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [intakeTime, setIntakeTime] = useState("Before Food");
    const [durationPicker, setDurationPicker] = useState();
    const [notesValue, setNotesValue] = useState("");
    const [inputValue, setInputValue] = useState("1");

    // Data arrays
    const dosages = ['1-0-0', '0-1-0', '0-0-1', '1-0-1', '1-1-0', '0-1-1', '1-1-1', '4 Times', '5 Times', '6 Times', 'SOS', 'Once a Week', 'Alt Day'];
    const intakeOptions = ['Before Food', 'After Food', 'Empty Stomach', 'Bed Time', 'Any Time'];
    const Dosage = ['Tabs', 'Caps', 'Inj', 'ML', 'TS', 'Drops', 'Puff', 'Local App'];
    const Duration = ['Day', 'Week', 'Month', 'Year'];
    const DurationPicker = [" ",'01', '02', '03', '04', '05', '06', '07', '10', '15', '20', '25', '30'];

    // Effect to autofill form when selectedMedication changes (edit mode)
    useEffect(() => {
        if (selectedMedication) {
            

         

    setSelectedFrequency(dosages.indexOf(selectedMedication.frequency));
    setSelectedDosage(Dosage.indexOf(selectedMedication.unit));
    setInputValue(selectedMedication.dosage);
    setIntakeTime(selectedMedication.consumptionTime);
    const formattedDuration = selectedMedication.duration !== undefined && selectedMedication.duration !== null
    ? selectedMedication.duration.toString().padStart(2, '0')
    : ''; // Default to empty string if undefined

        setDurationPicker(formattedDuration);

    setSelectedDuration(Duration.indexOf(selectedMedication.time));
    setNotesValue(selectedMedication.additionalNote || "");
        }
    }, [selectedMedication]);


    const handleSave = () => {





        // if (selectedFrequency === null) {
        //     Alert.alert('Please select frequency');
        //     return;
        // }
        // if (intakeTime === '') {
        //     Alert.alert('Please select intake time');
        //     return;
        // }
        // if ((inputValue === '' || isNaN(inputValue) || inputValue <= 0) && selectedDosage === null) {
        //     Alert.alert('Please select or enter a valid dosage');
        //     return;
        // }

        // if (durationPicker === '' && selectedDuration === null) {
        //     Alert.alert('Please select duration');
        //     return;
        // }
        if (selectedFrequency === -1) {
            Alert.alert('Please select frequency');
            return;
        }
        if (intakeTime === '') {
            Alert.alert('Please select intake time');
            return;
        }
        if ((inputValue === '' || isNaN(inputValue) || Number(inputValue) <= 0) && selectedDosage === -1) {
            Alert.alert('Please select or enter a valid dosage');
            return;
        }
        if (durationPicker === '' && selectedDuration === -1) {
            Alert.alert('Please select duration');
            return;
        }

        // Create the medication data to be saved
        const duration = parseInt(durationPicker, 10) || 0;
        const dosage = inputValue ? Number(inputValue) : 1; 
        const unit = Dosage[selectedDosage] || ""
        const consumptionTime = intakeTime || 'Before Food';
        const frequency = dosages[selectedFrequency] || '';
        const additionalNote = notesValue || '';
        const time = Duration[selectedDuration] || ""
        const drug=selectedProductName




        // Save data
        saveData({ duration, dosage, time, frequency, additionalNote, unit, consumptionTime,drug});

        // // Reset form fields
        // setSelectedFrequency(null);
        // setSelectedDosage(null);
        // setSelectedDuration(null);
        // setIntakeTime("");
        // setDurationPicker("");
        // setNotesValue("");
        // setInputValue("");
    };
    



    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modal_container}>
                <View style={styles.modal_content}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.modal_heading}>{selectedProductName}</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Icon name="close" size={15} color={whiteColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Frequency Section */}
                    <View>
                        <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                            <Icon name="repeat" size={24} color={greenColor} />
                            <Text style={styles.text}>Frequency </Text>
                        </View>
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={styles.button_row}
                            showsHorizontalScrollIndicator={false}
                        >
                            {dosages.map((dosage, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.button, selectedFrequency === index && styles.selected_button]}
                                    onPress={() => setSelectedFrequency(index)}
                                >
                                    <Text
                                        style={[styles.button_text, selectedFrequency === index && styles.selected_button_text]}
                                    >
                                        {dosage}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Time Section */}
                    <View>
                        <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                            <Icon name="clock" size={24} color={greenColor} />
                            <Text style={styles.text}>Intake Time</Text>
                        </View>
                        <View style={styles.picker_container}>
                            <Picker
                                selectedValue={intakeTime}
                                onValueChange={(itemValue) => setIntakeTime(itemValue)}
                                style={styles.picker}
                                mode="dropdown"
                            >
                                {intakeOptions.map((option, index) => (
                                    <Picker.Item label={option} value={option} key={index} style={{ fontSize: 12 }} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Dosage Section */}
                    <View>
                        <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                            <Icon name="pill" size={24} color={greenColor} />
                            <Text style={styles.text}>Dosage </Text>
                        </View>
                        <View style={styles.row}>
                            <TextInput
                                style={styles.input}
                                value={inputValue}
                                onChangeText={setInputValue}
                                keyboardType="numeric"
                                defaultValue="1"
                            />
                            <ScrollView
                                horizontal={true}
                                contentContainerStyle={styles.button_row}
                                showsHorizontalScrollIndicator={false}
                            >
                                {Dosage.map((dosage, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.button, selectedDosage === index && styles.selected_button]}
                                        onPress={() => setSelectedDosage(index)}
                                    >
                                        <Text style={[styles.button_text, selectedDosage === index && styles.selected_button_text]}>
                                            {dosage}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Duration Section */}
                    <View>
                        <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                            <Icon name="timer" size={24} color={greenColor} />
                            <Text style={styles.text}>Duration </Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.pickercontainer}>
                                <Picker
                                    selectedValue={durationPicker}
                                    onValueChange={(itemValue) => setDurationPicker(itemValue)}
                                    style={styles.Picker2}
                                    mode="dropdown"
                                >
                                    {DurationPicker.map((option, index) => (
                                        <Picker.Item label={option} value={option} key={index} style={{ fontSize: 12 }} />
                                    ))}
                                </Picker>
                            </View>
                            <ScrollView
                                horizontal={true}
                                contentContainerStyle={styles.button_row}
                                showsHorizontalScrollIndicator={false}
                            >
                                {Duration.map((duration, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.button, selectedDuration === index && styles.selected_button]}
                                        onPress={() => setSelectedDuration(index)}
                                    >
                                        <Text style={[styles.button_text, selectedDuration === index && styles.selected_button_text]}>
                                            {duration}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    {/* Notes Section */}
                    <View>
                        <View style={[styles.row, { marginTop: 10, marginBottom: 10 }]}>
                            <Text style={styles.text}>Notes(Optional) </Text>
                        </View>
                        <View>
                            <TextInput
                                style={[styles.input2]}
                                value={notesValue}
                                onChangeText={setNotesValue}
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <View>
                        <TouchableOpacity
                            style={{ padding: 12, backgroundColor: greenColor, margin: 10, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
                            onPress={handleSave}
                        >
                            <Text style={{ color: "white" }}>Save & Add Medicine</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default Medicin_Model;
;

const styles = StyleSheet.create({
    modal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal_content: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modal_heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10,
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
    picker_container: {
        borderWidth: 1,
        borderColor: greenColor,
        borderRadius: 5,
        height: 40,
        alignItems: "center",
        textAlign: "center",
    },
    pickercontainer: {
        borderWidth: 1,
        borderColor: greenColor,
        borderRadius: 5,
        width: 80,
        height: 40,
        marginRight: 10,
    },
    picker: {
        width: '100%',
        color: '#555',
    },
    Picker2: {
        textAlign: "left",
        color: '#555',

    },
    input: {
        height: 40,
        width: 60,
        borderWidth: 1,
        borderColor: greenColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        textAlign: 'center',
    },
    input2: {

        borderWidth: 1,
        borderColor: greenColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        // textAlign: 'center',
    },

    closeButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
