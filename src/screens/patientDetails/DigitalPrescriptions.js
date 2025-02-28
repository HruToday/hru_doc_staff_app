



import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { greenColor, whiteColor } from '../../common/Color';
import { downloadFile } from '../../components/FileDownloader';

const DigitalPrescriptions = ({ data }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);


    const formatDate = (date) => {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const day = new Date(date).getDate();
        const suffix = suffixes[(day % 10 > 3 || Math.floor((day % 100) / 10) === 1) ? 0 : day % 10];
        return `${day} ${new Date(date).toLocaleString('en-US', { month: 'short' })}`;
    };


    const handleOpenPdf = (url) => {
        setSelectedPdf(url);
        setModalVisible(true);
    };


    const handleClosePdf = () => {
        setModalVisible(false);
        setSelectedPdf(null);
    };


    const handleDownload = (url) => {
        const id = url.split('/doctor/')[1].split('/')[0];
        const fileName = `DigitalPrescriptions${id}.pdf`;
        downloadFile(url, fileName);
    };


    const handleDateClick = (date) => {
        if (selectedDate && new Date(date).toDateString() === new Date(selectedDate).toDateString()) {
            setSelectedDate(null);
        } else {
            setSelectedDate(date);
        }
    };


    const filteredData = selectedDate
        ? data.filter((item) => new Date(item.date).toDateString() === new Date(selectedDate).toDateString())
        : data;

    return (
        <View style={styles.container}>

            <View style={styles.leftPanel}>
               
                <ScrollView showsVerticalScrollIndicator={false}>
                    {Object.values(
                        data.reduce((acc, item) => {
                            const formattedDate = formatDate(item.date);
                            if (!acc[formattedDate]) {
                                acc[formattedDate] = item; // Store only the first occurrence
                            }
                            return acc;
                        }, {})
                    ).map((item, index) => {
                        const formattedDate = formatDate(item.date);


                        const isSelected = selectedDate &&
                            new Date(item.date).toDateString() === new Date(selectedDate).toDateString();

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                                onPress={() => handleDateClick(item.date)}
                            >
                                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                    {formattedDate}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

            </View>


            <ScrollView contentContainerStyle={styles.rightPanel} showsVerticalScrollIndicator={false}>
                {filteredData.map((item, index) => {
                    const pdfUrl = `https://beta.hru.today/doctor/${item._id}/prescription.pdf`;

                    return (
                        <View key={index} style={styles.card}>
                            <View style={styles.header}>
                                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                                <TouchableOpacity onPress={() => handleDownload(pdfUrl)}>
                                    <Icon name="download" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.header, { backgroundColor: 'lightgray' }]}>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.label}>Prescription No:</Text>
                                    <Text style={styles.value}>{item.prescriptionNo}</Text>
                                </View>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.label}>Next Follow-up:</Text>
                                    <Text style={styles.value}>{item.followupDays} Days</Text>
                                </View>
                            </View>

                            {/* PDF Preview */}
                            <TouchableOpacity onPress={() => handleOpenPdf(pdfUrl)} style={styles.pdfTouchable}>
                                <Pdf
                                    trustAllCerts={false}
                                    horizontal={false}
                                    source={{ uri: pdfUrl, cache: true }}
                                    style={styles.pdf}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>


            <Modal visible={modalVisible} animationType="slide" onRequestClose={handleClosePdf} transparent={false}>
                <View style={styles.modalContainer}>
                    {selectedPdf && (
                        <Pdf
                            renderActivityIndicator={() => <ActivityIndicator color="black" size="large" />}
                            source={{ uri: selectedPdf, cache: true }}
                            style={styles.fullScreenPdf}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
    },
    leftPanel: {
        width: '17%',
        backgroundColor: 'white',
        padding: 10,
    },
    dateItem: {
        // backgroundColor: 'lightgray',
        backgroundColor: '#e5e8e8',
        borderRadius: 10, // Slightly reduced for a modern look
        marginBottom: 10,
        textAlign: "center",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
        width: 45,  // Slightly increased for better touchability
         height: 35,
       

        // **Shadow for iOS**
        shadowColor: "rgba(26, 171, 161, 0.8)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1, // Fully apply the rgba color
        shadowRadius: 10, // S
        // **Shadow for Android**
        elevation: 5,
    },

    dateItemSelected: {
        backgroundColor: greenColor,
    },
    dateText: {
        color: 'black',
        fontSize: 10,
        textAlign: "center"
    },
    dateTextSelected: {
        color: whiteColor,

    },
    rightPanel: {

        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: greenColor,
        padding: 10,
    },
    date: {
        fontSize: 13,
        color: whiteColor,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems:"center",
        justifyContent:"center"
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'black',
    },
    value: {
        fontSize: 10,
        color: 'black',
    },
    pdfTouchable: {
        width: '100%',
        height: 400,
    },
    pdf: {
        width: '100%',
        height: 400,
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    fullScreenPdf: {
        width: '100%',
        height: '100%',
    },
});

export default DigitalPrescriptions;
