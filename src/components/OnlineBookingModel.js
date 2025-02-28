import React, { useState, useContext } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { greenColor } from '../common/Color';
import { AppContext } from '../context _api/Context';

const BookingConfirmationModal = ({ isVisible, onClose,onVerified  }) => {
    const { checkinData } = useContext(AppContext); // Accessing context
    const [bookingNumber, setBookingNumber] = useState(''); // State to store input value

    const handleVerify = () => {
        if (bookingNumber === checkinData.otp) {
           // 598559
            
            setBookingNumber("")
            onClose();
            onVerified ()
        } else {
            Alert.alert("Please Enter vaild OTP");

        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Header Row: Title and Close Icon */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.modalTitle}>Enter Booking Confirmation No</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={30} color={greenColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Input Field */}
                    <TextInput
                        style={styles.input}
                        placeholder="Booking Confirmation No"
                        keyboardType="numeric"
                        value={bookingNumber}
                        onChangeText={(text) => setBookingNumber(text)} // Update state on text change
                    />

                    {/* Buttons Row */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
                            <Text style={styles.buttonText}>Verify</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 320,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        marginLeft: 10,
    },
    input: {
        width: '100%',
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    verifyButton: {
        backgroundColor: greenColor,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BookingConfirmationModal;
