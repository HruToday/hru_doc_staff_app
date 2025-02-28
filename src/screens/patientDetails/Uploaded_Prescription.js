import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import { downloadFile } from '../../components/FileDownloader';
import PdfViewer from '../../components/PdfViewer';
import { greenColor, whiteColor } from '../../common/Color';


;

const Uploaded_Prescription = ({  data }) => {
  
    const flatListRef = useRef(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: 0, animated: true });
        }
    };
    
    
    

    const renderItem = (item) => {
       
            const imageId =
            item.uploadedPrescriptions?.[0]?.images?.[0]?.id ?? null;

       
        const imageUrl = imageId
            ? `https://beta.hru.today/prescription/${item._id}/${imageId}/display.image`
            : null;

        
            
            return (
                <View style={styles.card}>
                    <View style={styles.cardContent}>

                        <Text style={styles.cardText}>
                            Date: {new Date(item.startTime).toLocaleDateString()}
                        </Text>

                        <TouchableOpacity
                            style={styles.downloadButton}
                            onPress={() => {
                                const url = `https://beta.hru.today/doctor/${item._id}/prescription.pdf`;
                                setSelectedPdf(url);
                                const fileName = `prescription_${item.bookingId}.pdf`; // Unique file name
                                downloadFile(url, fileName);
                            }}
                        >
                            <Icon
                                name="file-download"
                                size={20}
                                color={whiteColor}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.cardContent,{backgroundColor:"lightgray"}]}>
                        <Text style={styles.cardText}>Transaction ID:{item.bookingId}</Text>

                        <Text style={styles.cardText}>
                            Time: {new Date(item.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </Text>

                    </View>
                    <Image
                       source={
                        imageUrl
                            ? { uri: imageUrl } // Use dynamic URL if available
                            : { uri: 'https://image.pngaaa.com/13/1887013-middle.png' } // Use fallback URL
                    }
                        style={styles.cardImage}
                    />
                </View>
            );
        
    };

    return (
        <View style={styles.container}>
            {data.length === 0 ? (
                <View style={styles.noDataContainer}>
                    <Image
                            source={require('../../assets/nodata.png')}
                        style={styles.noDataImage}
                    />
                </View>
            ) : (
                <>
                    {/* Table Header */}
                    {/* <View style={styles.header}>
            {headerData.map((headerItem, index) => (
              <Text key={index} style={styles.headerText}>
                {headerItem}
              </Text>
            ))}
          </View> */}

                    {/* Table Body */}
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        renderItem={({ item, index }) => (
                            <View key={index} style={styles.row}>
                                {renderItem(item)}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                    <Modal
                        visible={!!selectedPdf}
                        animationType="slide"
                        onRequestClose={() => setSelectedPdf(null)}>
                        <PdfViewer pdfUrl={selectedPdf} />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setSelectedPdf(null)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Modal>

                  
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff',
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardContent: {
        //   padding: 16,
        flexDirection: "row",
        backgroundColor: greenColor,
        justifyContent: "space-between",
        padding: 10,
    },
    cardText: {
        fontSize: 14,
        color: whiteColor,
        marginBottom: 4,
    },
    cardImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
        margin: 5
    },
    downloadButton: {
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    icon: {
        alignSelf: 'center',
    },
});


export default Uploaded_Prescription;
