import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { AppContext } from '../../context _api/Context';
import { patientMedicalHistory } from '../../api/authService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { greenColor, lightbackground } from '../../common/Color';
import { downloadFile } from '../../components/FileDownloader';
import PdfViewer from '../../components/PdfViewer';

const Medical_History = () => {
  const { userdata,selectedPatient,selectedDoctor } = useContext(AppContext);
 
  const [med_data, setMed_Data] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    console.log("ywa");
    
    const handlefetch = async () => {
      const token = userdata?.data?.token;
      const credentials = {
        token: token,
        patientId: selectedPatient._id,
        profileId: selectedPatient.patient_id,
        doctorId: selectedDoctor.length > 0 ? selectedDoctor : "ALL",
       
      };
console.log("credentials",credentials);



      try {
        const response = await patientMedicalHistory(credentials);
        console.log(response);
        
         setMed_Data(response.doc); // Assuming response.doc contains the necessary data
      } catch (error) {
        console.log(error.message); // Fixed typo from error.massage to error.message
      }
    };
    handlefetch();
  }, []);

  if (!med_data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={greenColor} />
      </View>


    );
  }
  const formatKey = (key) => {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space between camelCase words
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Top Section with Date and Icons */}
      <View style={styles.topSection}>
        <Text style={styles.dateText}>
          {new Date(med_data.date).toLocaleDateString()}
        </Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={(() => {


              const url = `https://beta.hru.today/doctor/${med_data._id}/medical-history.pdf`;
              const fileName = `medical-history${med_data.bookingId}.pdf`; // Unique file name
              setSelectedPdf(url);
              downloadFile(url, fileName);
            })}
          >
            <Ionicons name="download" size={20} color="white" />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Ionicons name="print" size={20} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>
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
      {/* Key-Value Info Section */}
      <View style={styles.infoSection}>

        {med_data.historyDetails ? ( // Check if historyDetails exists
          Object.entries(med_data.historyDetails)


            .filter(([key]) => !['lastUpdatedAt', 'hasData', '_id'].includes(key)) // Exclude the unwanted keys
            .map(([key, value]) => {

              const formattedKey = formatKey(key);
              if (Array.isArray(value)) {


                return (
                  <View key={key}>
                    <Text style={styles.sectionHeader}>{formattedKey}</Text>
                    {value.map((item, index) => (
                      <View key={index} style={styles.tableRow}>
                        {Object.entries(item).map(([subKey, subValue]) => (

                          <View key={subKey} style={styles.tableCellContainer}>
                            {/* Label as header outside of tableCell */}
                            <View
                              style={{ backgroundColor: 'lightgray', padding: 5 }}>
                              <Text
                                style={styles.headerText}>{`${formatKey(subKey)}:`}</Text>
                            </View>

                            {/* TableCell for the value */}
                            <View style={styles.tableCell}>
                              <Text style={styles.dataText}>{subValue}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                );
              } else {
                return (
                
                  <View key={key} style={styles.info_row}>
                  <View key={key} style={styles.info_row}>
                    <Text style={styles.info_text}>
                      <Text style={{ fontWeight: 'bold' }}>{formattedKey}</Text>: {value}
                    </Text>
                  </View>
                </View>
                

                );
              }
            })

        ) : (
          // Render an image if historyDetails does not exist
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/nodata.png')} // Replace with your image path
              style={styles.placeholderImage}
            />

          </View>
        )}
      </View>


      {/* Table Section */}
    </ScrollView>
   

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightbackground,
    padding: 10,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: greenColor,
    padding: 10,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 12,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoKey: {
    fontWeight: 'bold',
  },
  sectionHeader: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#b2babb",
    padding: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
    color: 'white',
  },
  tableSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tableCellContainer: {
    flex: 1,
  },
  tableCell: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 4,
    height: 30,
  },
  headerText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 9,
  },
  dataText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 10, // Lighter color for the data
  },
  info_row: {
    marginVertical: 5,
    flexDirection: 'row', // Ensures text remains inline
    flexWrap: 'wrap', // Allows wrapping only when necessary
    alignItems: 'center', // Aligns text properly
  },
  info_key: {
    fontWeight: 'bold',
  },
  info_value: {
    flexShrink: 1,
  },

});

export default Medical_History;
