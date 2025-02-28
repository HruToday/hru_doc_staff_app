import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import SecondHeader from '../../components/SecondHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../common/CustomButton';
import { greenColor, whiteColor } from '../../common/Color';
import { AppContext } from '../../context _api/Context';
import { saveprescriptiondetailspreviewjson, vitalsubmit } from '../../api/authService';
import PdfViewer from '../../components/PdfViewer';


const rowData = [
  { name: 'Vitals', icon: 'document-text-outline' },

  { name: 'LMP', icon: 'calendar-outline' },
  { name: 'Complaints', icon: 'list-outline' },
  { name: 'Diagnosis', icon: 'medkit-outline' },
  { name: 'Procedures', icon: 'flask-outline' },
  { name: 'Medication', icon: 'bandage-outline' },
  { name: 'Lab Test', icon: 'pulse-outline' },
  { name: 'Advice', icon: 'cloud-outline' },
  { name: 'Diet', icon: 'eye-outline' },
  { name: 'Follow up', icon: 'thermometer-outline' },
  { name: 'Refer', icon: 'heart-outline' },

];

const Prescription = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const appointmentId = route?.params?.appointmentId || '';
  const healthScheme = route?.params?.healthScheme || '';
  const [highlightRow, setHighlightRow] = useState(false);
const gender = route?.params?.gender || '';
const [selectedPdf, setSelectedPdf] = useState(null);
  const followupDays = route?.params?.followupDays || 0;
const { item, Digitalbutton_update, gendertoggle, GenderToggle, userdata, digital_id, Digital_ID, digital_Prescription, Digtail_PrescriptionData, } = useContext(AppContext);
 useEffect(() => {
    if (appointmentId) {

      Digital_ID({
        appointmentId: appointmentId,
        followupDays: followupDays
      });

    }

  }, [appointmentId]);
  useEffect(() => {
    GenderToggle(gender)
  }, [gendertoggle])
const token = userdata?.data?.auth_token;
const handleRowPress = row => {
    if (row.name == 'Vitals') {
      navigation.navigate('Vitals', {
        appointmentId: appointmentId, gender: gender, item: item
      });
    }

    if (row.name == 'Medication') {
      navigation.navigate('Medication', { appointmentId: appointmentId });
    }
    if (row.name == 'Diagnosis') {
      navigation.navigate('Diagnosis', { appointmentId: appointmentId });
    }
    if (row.name == 'Procedures') {
      navigation.navigate('Procedures', { appointmentId: appointmentId });
    }
    if (row.name == 'Complaints') {
      navigation.navigate('Complaints', { appointmentId: appointmentId });
    }
    if (row.name == 'Lab Test') {
      navigation.navigate('lab_test', { appointmentId: appointmentId });
    }
    if (row.name == 'Diet') {
      navigation.navigate('Diet', { appointmentId: appointmentId });
    }
    if (row.name == 'Refer') {
      navigation.navigate('Refer', { appointmentId: appointmentId });
    }
    if (row.name == 'Follow up') {
      navigation.navigate('FollowUp', { appointmentId: appointmentId, followupDays: followupDays });
    }
    if (row.name == 'Advice') {
      navigation.navigate('Advice', { appointmentId: appointmentId });
    }
    if (row.name == 'LMP') {
      navigation.navigate('lmp', { appointmentId: appointmentId });
    }


  };
  function getCurrentDateInFormats() {
    const date = new Date();

    // Format: YYYY-MM-DDTHH:mm:ss.sssZ
    const isoDate = date.toISOString();

    // Format: DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const customDate = `${day}/${month}/${year}`;

    return { isoDate, customDate };
  }

  const formatDateToISO = (dateString) => {
    // Split the date string (assuming "DD/MM/YYYY" format)
    const [day, month, year] = dateString.split("/");

    // Create a new Date object (UTC timezone)
    const date = new Date(Date.UTC(year, month - 1, day, 18, 30, 0));

    // Convert to ISO string
    return date.toISOString();
  };



  const keys = Object.keys(digital_Prescription);
  if (appointmentId !== keys[0]) {

  }
 



  


  const handleSubmit = async () => {
    try {
      const prescriptionId = Object.keys(digital_Prescription)?.[0]; // Get the first dynamic key (ID)
      const prescriptionData = digital_Prescription?.[prescriptionId] || {};

      const { isoDate } = getCurrentDateInFormats();
      const appointmentId = digital_id?.appointmentId || "";

      const baseCredentials = {
        token: token || "",
        appointmentId,
        vitalDate: isoDate || "",
        complaints: [],
        diagnosis: [],
        procedures: [],
        examination: [],
        medicineIntake: [],
        labs: [],
        advice: [],
        dietToAvoid: [],
        dietToConsume: [],
        customFieldOneValue: [],
        customFieldTwoValue: [],
        customFieldThreeValue: [],
        customFieldFourValue: [],
        customFieldFiveValue: [],
        customFieldSixValue: [],
        prescriptionStartDate: isoDate,
        followupDays: digital_id?.followupDays || "",
        followupUnit: "Day",
        medicalHistoryData: {},
      };

      let extraFields = {};

      if (Object.keys(prescriptionData).length > 0) {

        const labTests =
          prescriptionData?.labtest?.map((item) => ({
            testLabName: item.product_name,
          })) || [];

        extraFields = {
          weight: prescriptionData?.weight || "",
          height: prescriptionData?.height || "",
          bpSystolic: prescriptionData?.bpSystolic || "",
          bpDiastolic: prescriptionData?.bpDiastolic || "",
          pulse: prescriptionData?.pulse || "",
          bodyTemp: prescriptionData?.bodyTemp || "",
          bmi: prescriptionData?.bmi || "",
          bmiStatus: prescriptionData?.bmiStatus || "",
          bloodSugarTest: prescriptionData?.bloodSugar || "",
          sugarLevel: prescriptionData?.sugarLevel || "",
          complaints: prescriptionData?.Complaints || [],
          diagnosis: prescriptionData?.Diagnosis || [],
          procedures: prescriptionData?.Procedures || [],
          medicineIntake: prescriptionData?.medications || [],
          labs: labTests || [],
          advice: prescriptionData?.advice || [],
          dietToAvoid: prescriptionData?.diet?.avoid || [],
          dietToConsume: prescriptionData?.diet?.consume || [],
          otherNote: prescriptionData?.otherNote || "",
          respiration: prescriptionData?.spo2 || "",
          specialistName:prescriptionData?.referdata?.specialistName,
          notes:prescriptionData?.referdata?.notes,
          consultDietitian:prescriptionData?.diet?.chek,
          clinicHospital:prescriptionData?.referdata?.clinicHospital,
          medicineTag: "Yes"
        };
      }

      const credentials = { ...baseCredentials, ...extraFields };
      const followupText = prescriptionData?.followup?.text?.trim();
      const inputDate = prescriptionData?.followup?.date;
      let isoFormattedDate = null; // Default value

      if (inputDate && inputDate !== false) {
        isoFormattedDate = formatDateToISO(inputDate);
      }
      if (prescriptionData?.followup?.date === false) {
        credentials.followupDays = followupText || digital_id?.followupDays || "";
        credentials.followupUnit = prescriptionData?.followup?.dosage || "days";

      } else {
        credentials.followupDate = isoFormattedDate;
      }
      if (credentials.followupDate) {
        delete credentials.followupDays;
        delete credentials.followupUnit;
      }

      if (prescriptionData?.Complaints?.length > 0) {
        credentials.complaintsMetaData =
          prescriptionData?.Complaints_metadata || [];
      }

      if (prescriptionData?.Diagnosis?.length > 0) {
        credentials.diagnosisMetaData =
          prescriptionData?.Diagnosis_metadata || [];
      }

      if (prescriptionData?.Procedures?.length > 0) {
        credentials.procedureMetaData =
          prescriptionData?.Procedures_metadata || [];
      }

    
console.log("credentials",credentials);

      const response = await vitalsubmit(credentials);
    
      

      if (response?.msg === "Ok") {
        Digitalbutton_update({ _id: appointmentId }, "Edit Prescription");
        navigation.navigate("WorkQueueMain");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error.message);
    }
  };


  const handlePreview = (async () => {
   
    try {
      const prescriptionId = Object.keys(digital_Prescription)?.[0]; 
            const prescriptionData = digital_Prescription?.[prescriptionId] || {};
      
            const { isoDate } = getCurrentDateInFormats();
            const appointmentId = digital_id?.appointmentId || "";
      
            const baseCredentials = {
              token: token || "",
              appointmentId,
              vitalDate: isoDate || "",
              complaints: [],
              diagnosis: [],
              procedures: [],
              examination: [],
              medicineIntake: [],
              labs: [],
              advice: [],
              dietToAvoid: [],
              dietToConsume: [],
              customFieldOneValue: [],
              customFieldTwoValue: [],
              customFieldThreeValue: [],
              customFieldFourValue: [],
              customFieldFiveValue: [],
              customFieldSixValue: [],
              prescriptionStartDate: isoDate,
              followupDays: digital_id?.followupDays || "",
              followupUnit: "Day",
              medicalHistoryData: {},
            };
      
            let extraFields = {};
      
            if (Object.keys(prescriptionData).length > 0) {
      
              const labTests =
                prescriptionData?.labtest?.map((item) => ({
                  testLabName: item.product_name,
                })) || [];
      
              extraFields = {
                weight: prescriptionData?.weight || "",
                height: prescriptionData?.height || "",
                bpSystolic: prescriptionData?.bpSystolic || "",
                bpDiastolic: prescriptionData?.bpDiastolic || "",
                pulse: prescriptionData?.pulse || "",
                bodyTemp: prescriptionData?.bodyTemp || "",
                bmi: prescriptionData?.bmi || "",
                bmiStatus: prescriptionData?.bmiStatus || "",
                bloodSugarTest: prescriptionData?.bloodSugar || "",
                sugarLevel: prescriptionData?.sugarLevel || "",
                complaints: prescriptionData?.Complaints || [],
                diagnosis: prescriptionData?.Diagnosis || [],
                procedures: prescriptionData?.Procedures || [],
                medicineIntake: prescriptionData?.medications || [],
                labs: labTests || [],
                advice: prescriptionData?.advice || [],
                dietToAvoid: prescriptionData?.diet?.avoid || [],
                dietToConsume: prescriptionData?.diet?.consume || [],
                otherNote: prescriptionData?.otherNote || "",
                respiration: prescriptionData?.spo2 || "",
                specialistName:prescriptionData?.referdata?.specialistName,
                notes:prescriptionData?.referdata?.notes,
                clinicHospital:prescriptionData?.referdata?.clinicHospital,
                consultDietitian:prescriptionData?.diet?.chek,
                
              };
            }
      
            const credentials = { ...baseCredentials, ...extraFields };
            const followupText = prescriptionData?.followup?.text?.trim();
            const inputDate = prescriptionData?.followup?.date;
            let isoFormattedDate = null; // Default value
      
            if (inputDate && inputDate !== false) {
              isoFormattedDate = formatDateToISO(inputDate);
            }
            if (prescriptionData?.followup?.date === false) {
              credentials.followupDays = followupText || digital_id?.followupDays || "";
              credentials.followupUnit = prescriptionData?.followup?.dosage || "days";
      
            } else {
              credentials.followupDate = isoFormattedDate;
            }
            if (credentials.followupDate) {
              delete credentials.followupDays;
              delete credentials.followupUnit;
            }
      
            if (prescriptionData?.Complaints?.length > 0) {
              credentials.complaintsMetaData =
                prescriptionData?.Complaints_metadata || [];
            }
      
            if (prescriptionData?.Diagnosis?.length > 0) {
              credentials.diagnosisMetaData =
                prescriptionData?.Diagnosis_metadata || [];
            }
      
            if (prescriptionData?.Procedures?.length > 0) {
              credentials.procedureMetaData =
                prescriptionData?.Procedures_metadata || [];
            }
         console.log("credentials",credentials);
         
            

           const response = await saveprescriptiondetailspreviewjson(credentials)
          
           
     


      if (healthScheme === "RGHS") {

        setModalVisible(true);
      } else {
        const url = `https://beta.hru.today/doctor/${digital_id.appointmentId}/prescription.pdf`

        setSelectedPdf(url);
      }
    } catch (error) {
      console.log(error.message);

    }








  })

  return (
    <>
      <SecondHeader
        title="Vitals & Prescription"
        onBackPress={() => navigation.navigate("WorkQueueMain")}
        showLocationDropdown={false}
        showSearch={false}
        topBarStyle={{ justifyContent: 'flex-start', gap: 10 }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {rowData.map((row, index) => {
          if (gendertoggle !== 'FEMALE' && row.name === 'LMP') {
            return null;
          }
          // const prescriptionId = Object.keys(digital_Prescription)[0];
          const prescriptionId=appointmentId

          const prescriptionData = digital_Prescription[prescriptionId] || {};

          const dataMapping = {
            'Complaints': prescriptionData?.Complaints,
            'Diagnosis': prescriptionData?.Diagnosis,
            'Procedures': prescriptionData?.Procedures,
            'Medication': prescriptionData?.medications,
            'Lab Test': prescriptionData?.labtest,
            'Advice': prescriptionData?.advice,
            'Diet': prescriptionData?.diet,
            'Follow up': prescriptionData?.followup,
            'Refer': prescriptionData?.referdata,
            "LMP": prescriptionData?.lmp,
            "Vitals": prescriptionData?.bloodSugar ||
              prescriptionData?.bmi || prescriptionData?.bmiStatus || prescriptionData?.bodyTemp || prescriptionData?.bpDiastolic ||
              prescriptionData?.bpSystolic || prescriptionData?.height || prescriptionData?.pulse || prescriptionData?.spo2 ||
              prescriptionData?.sugarLevel || prescriptionData?.weight
          };

          const hasData = dataMapping[row.name] && Object.keys(dataMapping[row.name]).length > 0;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.row, hasData ? styles.rowHighlight : null]}
              onPress={() => handleRowPress(row)}>
              <View style={styles.leftSection}>
                <Ionicons name={row.icon} size={24} color={hasData ? greenColor : '#000'} />
                <Text style={[styles.rowText, { color: hasData ? greenColor : '#000' }]}>{row.name}</Text>
              </View>

              <View style={styles.roundIcon}>
                <Ionicons name={hasData ? "checkmark-outline" : "add"} size={16} color={whiteColor} />
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ flexDirection: "row", gap: 5 }}>
          <CustomButton style={{ width: "50%", backgroundColor: "#145d89" }} title={'Preview'} onPress={handlePreview} />
          <CustomButton style={{ width: "50%" }} onPress={handleSubmit} title={'Submit'} />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>
              Select the desired format
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
              }}>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                  const url = `https://beta.hru.today/doctor/${digital_id.appointmentId}/prescription.pdf`

                  setSelectedPdf(url);
                }}>
                <Text style={styles.buttonText}>HRU Format</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setModalVisible(false);
                  const url = `https://beta.hru.today/doctor/${digital_id.appointmentId}/rghs-prescription.pdf`

                  setSelectedPdf(url);

                }}>
                <Text style={styles.buttonText}>RGHS Format</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={!!selectedPdf}
        animationType="slide"
        onRequestClose={() => setSelectedPdf(null)}>
        <PdfViewer pdfUrl={selectedPdf} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedPdf(null)}>

        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Prescription;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rowHighlight: {
    borderColor: greenColor,
    borderWidth: 1,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  roundIcon: {
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: greenColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1, // Ensure it covers the whole screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background for overlay effect
  },
  gradient: {
    flex: 1, // Fill the entire modal area with gradient
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%', // Ensure the gradient covers the full screen
  },
  modalContainer: {
    width: '85%',
    height: 230, // Height of the modal
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#34495e',
  },
  button: {
    backgroundColor: greenColor,
    height: 50,
    width: 120,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    // fontWeight: 'bold',
    color: 'white',
  },
});
