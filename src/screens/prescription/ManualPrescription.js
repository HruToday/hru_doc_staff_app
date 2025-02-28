import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import DocumentPicker from 'react-native-document-picker';
import { grayColor, greenColor, lightbackground } from '../../common/Color';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  prescriptionUpload,
  ReportUpload,
  vitalsubmit,
} from '../../api/authService';
import { AppContext } from '../../context _api/Context';
import SecondHeader from '../../components/SecondHeader';
import RNFS from 'react-native-fs';
import { Picker } from '@react-native-picker/picker';
import { downloadFile } from '../../components/FileDownloader';
import PdfViewer from '../../components/PdfViewer';

const InputField = ({ label, value, onChangeText, ...props }) => {
  return (
    <View style={styles.inputContainer}>
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

const ManualPrescription = ({ navigation, route }) => {
  const { appointmentId, item } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [spo2, setSpo2] = useState('');
  const [bodyTemp, setBodyTemp] = useState('');
  const [bmi, setBmi] = useState('');
  const [bmiStatus, setBmiStatus] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [sugarLevel, setSugarLevel] = useState('');
  const [otherNote, setOtherNote] = useState('');
  const [sendfile, setSendFile] = useState([]);
  const [prescriptionSend, setPrescriptionSend] = useState([]);
  const [reportFile, setReportFile] = useState([]);
  const [prescriptionFiles, setPrescriptionFiles] = useState([]);
  const [currentUpload, setCurrentUpload] = useState('prescription');
  const {
    userdata,
    workqueuebuttons,
    hideView,
    toggleHideView,
    hideViewforReport,
    toggleHideViewForReport,
    prescription_pdfId,
    showPrescription_pdf,
    vitalsData,
    updateVitalsData,
    showReport_pdf,
    report_pdfId,
  } = useContext(AppContext);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadCompletePre, setUploadCompletePre] = useState(false);
  const [isPrescriptionActive, setPrescriptionActive] = useState(true); // Default active
  const [isReportActive, setReportActive] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  useEffect(() => {
    const weight = vitalsData[appointmentId]?.weight || '';
    const height = vitalsData[appointmentId]?.height || '';

    if (weight && height) {
      const calculatedBmi = calculateBMI(weight, height);
      updateVitalsData(appointmentId, 'bmi', calculatedBmi); // Update BMI in Context API
    }
  }, [vitalsData[appointmentId]?.weight, vitalsData[appointmentId]?.height]);

  function calculateBMI(weight, height) {
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }
    return '';
  }

  const pickFile = async type => {
    setUploadComplete(false);
    setUploadCompletePre(false);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });

      // Convert the file to base64 for each selected file
      const base64Files = await Promise.all(
        res.map(async file => {
          const filePath = file.uri;
          const base64Data = await RNFS.readFile(filePath, 'base64');
          return { ...file, base64Data };
        }),
      );

      if (type === 'report') {
        setReportFile(prevFiles => [...prevFiles, ...base64Files]);
        setSendFile(base64Files);
        setCurrentUpload('report');
      } else if (type === 'prescription') {
        setPrescriptionFiles(prevFiles => [...prevFiles, ...base64Files]);
        setPrescriptionSend(base64Files);
        setCurrentUpload('prescription');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {

      } else {
        console.error(err);
      }
    }
  };

  const handleSubmit = async () => {
    const dataToSubmit = vitalsData[appointmentId];
    if (!showPrescription_pdf || showPrescription_pdf.length === 0) {
      Alert.alert('Please add prescription files ');
      return;
    }
    const token = userdata?.data?.auth_token;

    const credentials = {
      token: token,
      appointmentId: appointmentId,
      // weight: weight,
      // height: height,
      // bpSystolic: bpSystolic,
      // bpDiastolic: bpDiastolic,
      // pulse: pulse,
      // spo2: spo2,
      // bodyTemp: bodyTemp,
      // bmi: bmi,
      // bloodSugarTest: bloodSugar,
      // sugarLevel: sugarLevel,
      // otherNote: otherNote,
      ...dataToSubmit,
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
    };

    try {
      const response = await vitalsubmit(credentials);
      if (response.msg === 'Ok') {
      }
      Alert.alert('Prescription has been created.');
      workqueuebuttons({ _id: appointmentId }, 'Edit Prescription');
      navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
    } catch (error) {
      console.log(error.massage);
    }
  };

  const removeFile = (type, index = null) => {
    if (type === 'report') {
      if (index !== null) {
        const updatedReportFiles = [...reportFile];
        updatedReportFiles.splice(index, 1);
        setReportFile(updatedReportFiles);
      } else {
        setReportFile([]); // Keep as an empty array instead of null
      }
    } else if (type === 'prescription') {
      if (index !== null) {
        const updatedPrescriptionFiles = [...prescriptionFiles];
        updatedPrescriptionFiles.splice(index, 1);
        setPrescriptionFiles(updatedPrescriptionFiles);
      } else {
        setPrescriptionFiles([]);
      }
    }
  };
  sendfile.forEach(item => {
    if (!item.base64Data.startsWith(`data:${item.type};base64,`)) {
      item.base64Data = `data:${item.type};base64,${item.base64Data}`;
    }
  });

  const sendReportUpload = async () => {
    if (sendfile.length === 0) {
      Alert.alert('No files to upload.');
      return;
    }
    if (text.length === 0) {
      Alert.alert('Report Name is required.');
      return;
    }
    const token = userdata?.data?.auth_token;
    const credentials = {
      token: token,
      formData: {
        reportType: text,
        appointmentId: appointmentId,
      },
      reportFiles: sendfile.map(file => ({
        path: file.base64Data,
      })),
    };

    try {
      setLoading(true);
      const response = await ReportUpload(credentials);
      



      if (response.msg === 'Report uploaded successfully.') {
        Alert.alert('Report has been uploaded');
        report_pdfId(response.result.doc.uploadedReports[0].id)
        setReportFile([]);
        setUploadComplete(true);
        toggleHideViewForReport(appointmentId);
      }
    } catch (error) {
      console.log(error.massage);
    } finally {
      setLoading(false);
    }
  };
  prescriptionSend.forEach(item => {
    if (!item.base64Data.startsWith(`data:${item.type};base64,`)) {
      item.base64Data = `data:${item.type};base64,${item.base64Data}`;
    }
  });

  const sendPrescriptionUpload = async () => {
    if (prescriptionSend.length === 0) {
      Alert.alert('No files to upload.');
      return;
    }
    const token = userdata?.data?.auth_token;
    const credentials = {
      token: token,
      appointmentId: appointmentId,
      prescriptions: prescriptionSend.map(file => ({
        path: file.base64Data,
      })),
    };

    try {
      setLoading(true);
      const response = await prescriptionUpload(credentials);


      if (response.msg === 'Prescriptions uploaded successfully.') {
        Alert.alert('Prescription has been uploaded.');
        prescription_pdfId(response.result.doc._id);
        setPrescriptionFiles([]);
        toggleHideView(appointmentId);
        setUploadCompletePre(true);
      }
    } catch (error) {
      console.log(error.massage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <SecondHeader
        title="Manual Prescription"
        onBackPress={() => navigation.goBack()}
        showLocation={false}
        showSearch={false}
        showLocationDropdown={false}
        topBarStyle={{ justifyContent: 'flex-start' }}
      />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={greenColor} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[lightbackground, '#aed6f1']}
            style={styles.gradientsecond}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.container}>
              <View>
                <View style={styles.row}>
                  <InputField
                    label="Weight (Kg)"
                    value={vitalsData[appointmentId]?.weight || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'weight', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="Height (Cms)"
                    value={vitalsData[appointmentId]?.height || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'height', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="BP Systolic (mmHg)"
                    value={vitalsData[appointmentId]?.bpSystolic || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'bpSystolic', value)
                    }
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.row}>
                  <InputField
                    label="BP Diastolic (mmHg)"
                    value={vitalsData[appointmentId]?.bpDiastolic || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'bpDiastolic', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="Pulse (per/min)"
                    value={vitalsData[appointmentId]?.pulse || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'pulse', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="Body Temp. (F/C)"
                    value={vitalsData[appointmentId]?.bodyTemp || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'bodyTemp', value)
                    }
                  />
                </View>
                <View style={styles.row}>
                  <InputField
                    label="BMI (Kg/m^2)"
                    value={vitalsData[appointmentId]?.bmi || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'bmi', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="SPO2 (%)"
                    value={vitalsData[appointmentId]?.spo2 || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'spo2', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="BMI Status"
                    value={vitalsData[appointmentId]?.bmiStatus || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'bmiStatus', value)
                    }
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.pickerstyle}>
                    <Text style={styles.label}>Blood Sugar Test</Text>
                    <Picker
                      selectedValue={bloodSugar}
                      onValueChange={itemValue => setBloodSugar(itemValue)}
                      style={styles.picker}>
                      <Picker.Item label="Fasting" value="Fasting" />
                      <Picker.Item label="PP" value="PP" />
                      <Picker.Item label="Random" value="Random" />
                    </Picker>
                  </View>
                  <InputField
                    label="Sugar Level"
                    value={vitalsData[appointmentId]?.sugarLevel || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'sugarLevel', value)
                    }
                    keyboardType="numeric"
                  />
                  <InputField
                    label="Other Note"
                    value={vitalsData[appointmentId]?.otherNote || ''}
                    onChangeText={value =>
                      updateVitalsData(appointmentId, 'otherNote', value)
                    }
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              <View style={styles.containerforupload}>
                <View style={styles.nav}>
                  <TouchableOpacity
                    style={[
                      styles.touchcontainer,
                      isPrescriptionActive && styles.activeBorder,
                      isReportActive && styles.activeBorderhide, // Apply white border if active
                    ]}
                    onPress={() => {
                      setCurrentUpload('prescription');
                      setReportActive(false); // Activate this button
                      setPrescriptionActive(true);
                    }}>
                    <Text style={[styles.buttonText1]}>Upload Prescription</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.touchcontainer2,
                      isPrescriptionActive && styles.activeBorderhide,
                      isReportActive && styles.activeBorder,
                    ]}
                    onPress={() => {
                      setCurrentUpload('report');

                      setPrescriptionActive(false); // Activate this button
                      setReportActive(true);
                    }}>
                    <Text style={[styles.buttonText2]}>Report Upload</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.selectedFilesContainer}>
                  {currentUpload === 'prescription' && (
                    <>
                      <View style={styles.Card}>
                        <View style={styles.dashview}>
                          <TouchableOpacity
                            style={styles.touch}
                            onPress={() => {
                              pickFile('prescription');
                            }}>
                            <Text style={{ textAlign: 'center', color: 'black' }}>
                              Click to prescription upload
                            </Text>
                          </TouchableOpacity>
                          {hideView[appointmentId] && (
                            <View>
                              <Icon
                                name="file-pdf-o"
                                size={35}
                                color="red"
                                style={styles.icon}
                                onPress={() => {
                                  const url = `https://beta.hru.today/doctor/${showPrescription_pdf}/prescription.pdf`;
                                  const fileName = `prescription${showPrescription_pdf}.pdf`;
                                  setSelectedPdf(url);

                                  downloadFile(url, fileName);
                                }}
                              />

                              <Icon
                                name="trash"
                                size={20}
                                color="black"
                                style={{ padding: 5, marginLeft: 8 }}
                                
                              />
                            </View>
                          )}

                          <ScrollView style={styles.scrollView}>
                            {prescriptionFiles.map((file, index) => (
                              <View key={index} style={styles.selectedFile}>
                                <Text
                                  style={[styles.fileName, { color: greenColor }]}>
                                  {file.name}
                                </Text>
                                <Pressable
                                  onPress={() =>
                                    removeFile('prescription', index)
                                  }
                                  style={styles.removeFileButton}>
                                  <Text style={styles.removeFileText}>
                                    Remove
                                  </Text>
                                </Pressable>
                              </View>
                            ))}
                          </ScrollView>

                          <Pressable
                            style={styles.UploadButton}
                            onPress={sendPrescriptionUpload}>
                            <Text style={styles.removeFileText}>Upload File</Text>
                          </Pressable>
                        </View>
                      </View>
                    </>
                  )}
                  {currentUpload === 'report' && (
                    <>
                      <View style={styles.Card}>
                        <View style={styles.dashview}>
                          <TouchableOpacity
                            style={styles.touch}
                            onPress={() => pickFile('report')}>
                            <Text style={{ textAlign: 'center', color: 'black' }}>
                              Click to report upload
                            </Text>
                          </TouchableOpacity>
                          {hideViewforReport[appointmentId] && (
                            <View>
                              <Icon
                                name="file-pdf-o"
                                size={35}
                                color="red"
                                style={styles.icon}
                                onPress={() => {
                                  // const url = `https://beta.hru.today/doctor/${appointmentId}/${showReport_pdf}/report.pdf`;
                                  //  console.log(url);
                                  
                                  // setSelectedPdf(url);
                              



                                }}
                              />

                              <Icon
                                name="trash"
                                size={20}
                                color="black"
                                style={{ padding: 5, marginLeft: 8 }}
                              
                              />
                            </View>
                          )}
                          <ScrollView style={styles.scrollView}>
                            {reportFile.map((file, index) => (
                              <View key={index} style={styles.selectedFile}>
                                <Text style={styles.fileName}>{file.name}</Text>
                                <Pressable
                                  onPress={() => removeFile('report', index)}
                                  style={styles.removeFileButton}>
                                  <Text style={styles.removeFileText}>
                                    Remove
                                  </Text>
                                </Pressable>
                              </View>
                            ))}
                          </ScrollView>
                          <TextInput
                            style={styles.input}
                            value={text} // Bind the state to the TextInput
                            onChangeText={setText} // Update the state on text change
                            placeholder="Report Name"
                          />
                          <Pressable
                            style={styles.UploadButton}
                            onPress={sendReportUpload}>
                            <Text style={styles.removeFileText}>Upload File</Text>
                          </Pressable>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, { width: '100%' }]}
                  onPress={handleSubmit}>
                  <Text style={[styles.buttonText, { color: 'white' }]}>
                    Save Vitals
                  </Text>
                </Pressable>
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
          </LinearGradient>
        </ScrollView>)}
    </>
  );
};

export default ManualPrescription;

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    borderWidth: 1,
    width: 40,
    borderColor: 'lightgray',
  },
  gradientsecond: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  activeBorder: {
    // borderColor: 'white',
    borderBottomWidth: 0,
  },
  activeBorderhide: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  scrollView: { flex: 1 },
  pickerstyle: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 10,
    // fontSize: 16,
    width: '32%',
    height: 40,
    marginLeft: 4,
  },
  touch: {
    height: 50,
    backgroundColor: '#f4f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  Card: {
    // borderRadius:10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    // borderStyle:"dashed",
    padding: 10,
    // margin: 10,
  },
  dashview: {
    borderRadius: 10,
    margin: 10,
    borderColor: greenColor,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 10,
    color: greenColor,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },

  button: {
    backgroundColor: greenColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  containerforupload: {
    // borderWidth: 1,
    marginTop: 15,
    borderColor: '#E0E0E0',
    borderRadius: 12,

    backgroundColor: '#FFFFFF', // Clean white background
    shadowColor: '#000', // Adding subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Shadow effect for Android
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    height: 50,
  },
  touchcontainer2: {
    flex: 1, // Each button takes up an equal share of space
    justifyContent: 'center', // Center the content vertically

    borderWidth: 1,
    borderColor: 'lightgray',
  },
  buttonText1: {
    color: greenColor,
    fontSize: 13,

    textAlign: 'center',
  },
  buttonText2: {
    color: greenColor,
    fontSize: 13,
    textAlign: 'center',
  },
  buttonText: {
    color: greenColor,
    fontSize: 13,
    textAlign: 'center',
  },

  selectedFilesContainer: {
    // paddingVertical: 10,
    // height: 400,
  },
  scrollView: {
    height: 200, // Set a fixed height for the ScrollView
  },
  selectedFile: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'transparent',
    borderRadius: 10,

    padding: 20,
  },
  fileName: {
    fontSize: 14,
    color: greenColor,
  },
  removeFileButton: {
    backgroundColor: greenColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  UploadButton: {
    backgroundColor: greenColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: '30%',
    height: 40,
    margin: 10,
    justifyContent: 'center',
  },
  removeFileText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
