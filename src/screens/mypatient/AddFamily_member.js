import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  ScrollView,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import {
  blackColor,
  fontFamily,
  grayColor,
  greenColor,
  lightbackground,
  redColor,
  whiteColor,
} from '../../common/Color';
import CustomButton from '../../common/CustomButton';
import SecondHeader from '../../components/SecondHeader';
import { AppContext } from '../../context _api/Context';
import {
  addNewPatientFamilyMember,
  bookAppointmentNowPatient,
  fetchPatientList,
  savenewPatients,
} from '../../api/authService';

import uuid from 'react-native-uuid';
import DateOfBirthCalculator from '../../components/DateCalculation';

const AddFamily_member = ({ navigation }) => {
  const { membermobile,userdata, selectedLocationId, patientFamily_id } =
    useContext(AppContext);
    console.log(membermobile);
    
  const uniqueId = uuid.v4();

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const [photo, setPhoto] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    profile_pic_image: '',
    uidNo: uniqueId,

    remarks: '',
    dob: dob,
  });

  const [formErrors, setFormErrors] = useState({});

  const defaultImageUrl =
    'https://beta.hru.today/patient/:673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image';

  const token = userdata?.data?.auth_token;
  const [selectedValue, setSelectedValue] = useState('--Select--');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isHealthSchemeDropdownVisible, setHealthSchemeDropdownVisible] =
    useState(false);
  const [selectedHealthScheme, setSelectedHealthScheme] = useState(
    'Select Health Scheme',
  );
  const data = [
    'Son of',
    'Daughter of',
    'Brother of',
    'Sister of',
    'Grand Child of',
    'Other',
  ];
  const handleChoosePhoto = () => {
    // Open gallery or camera based on user choice
    Alert.alert(
      'Choose Photo Source',
      'Select whether you want to pick a photo from gallery or take a photo with the camera.',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(), // Open the camera
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(), // Open the gallery
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };


  const healthSchemeData = ['RGHS', 'ECLSH'];
  const handleSelectHealthScheme = item => {
    setSelectedHealthScheme(item);
    setHealthSchemeDropdownVisible(false);
    setFormData({ ...formData, healthScheme: item });
  };

  const handleSelect = value => {
    setSelectedValue(value);
    setDropdownVisible(false);
    setFormData({ ...formData, relationship: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.firstName) {
      errors.firstName = 'First Name is required';
    }
    if (!formData.lastName) {
      errors.lastName = 'Last Name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const credentials = {
      token,
      patientId: patientFamily_id,
      workAddressId: selectedLocationId,
      formData: formData,
    };
    


    // try {
    //   const response = await addNewPatientFamilyMember(credentials);
    //   if (response.msg === 'Ok') {
    //     navigation.navigate('familymember');
    //   } else {
    //     Alert.alert(response.msg);
    //   }
    // } catch (error) {
    //   console.error(error.message);
    // }
  };

  const handlePhotoPick = pickedPhoto => {
    setFormData({
      ...formData,
      profile_pic_image: pickedPhoto,
    });
  };
  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: false,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 600,
      compressImageQuality: 0.7,
      includeBase64: true,
    })
      .then(image => {
        const pickedPhoto = { uri: image.path }; // Get the picked image
        setPhoto(pickedPhoto); // Set the picked image as the profile pic
        const forbase_64 = image.data; // Get base64 data if needed
        handlePhotoPick(forbase_64); // Pass base64 image data to form data
      })
      .catch(error => {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to pick an image.');
      });
  };
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300, // Optional: Resize the image to 300px width
      height: 400, // Optional: Resize the image to 400px height
      cropping: false, // Optional: Enable cropping after capture
      compressImageQuality: 0.7,
      includeBase64: true,
    })
      .then(image => {
        const pickedPhoto = { uri: image.path }; // Get the captured image
        setPhoto(pickedPhoto); // Set the captured image as the profile pic
        const forbase_64 = image.data; // Get base64 data if needed
        handlePhotoPick(forbase_64); // Pass base64 image data to form data
      })
      .catch(error => {
        console.error('Camera error:', error);
        Alert.alert('Error', 'Failed to capture a photo.');
      });
  };



  return (
    <>
      <View style={{ flex: 1, backgroundColor: lightbackground }}>

        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                {photo ? (
                  <Image
                    source={photo}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{ uri: defaultImageUrl }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                )}
              </View>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleChoosePhoto}>
                <View style={styles.uploadIconContainer}>
                  <Icon name="cloud-upload" size={25} color="white" />
                </View>
              </TouchableOpacity>
              <Text>MobileNo. {membermobile}</Text>
            </View>
            <View style={styles.formContainer}>
              {[
                { label: 'First Name', key: 'firstName' },
                { label: 'Middle Name', key: 'middleName' },
                { label: 'Last Name', key: 'lastName' },
               
              ].map(({ label, key, ...props }) => (
                <View key={key}>
                  <Text style={styles.label}>
                    {label}

                    {(key === 'firstName' || key === 'lastName') && (
                      <Text style={styles.required}>*</Text>
                    )}

                  </Text>
                  <TextInput
                    style={[styles.input, formErrors[key] && styles.inputError]}
                    value={formData[key]}
                    onChangeText={text => {
                      setFormData({ ...formData, [key]: text });
                      setFormErrors({ ...formErrors, [key]: '' });
                    }}
                    {...props}
                  />


                  {formErrors[key] && (
                    <Text style={styles.errorText}>{formErrors[key]}</Text>
                  )}
                </View>
              ))}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text >Relationship</Text>
                <Text style={styles.required}>*</Text>
              </View>

              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(true)}>
                <Text style={styles.selectedText}>{selectedValue}</Text>
              </TouchableOpacity>
              <Modal
                visible={isDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setDropdownVisible(false)}
                >
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={data}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleSelect(item)}>
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
             

              <DateOfBirthCalculator dob={dob} setDob={setDob} />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioGroup}>
                {['male', 'female'].map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => {
                      setGender(option);
                      setFormData({ ...formData, gender: option });
                    }}>
                    <Icon
                      name={gender === option ? 'dot-circle-o' : 'circle-o'}
                      size={20}
                      color={greenColor}
                    />
                    <Text style={styles.radioText}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.label}>Health Scheme</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setHealthSchemeDropdownVisible(true)}>
                <Text style={styles.selectedText}>{selectedHealthScheme}</Text>
              </TouchableOpacity>
              <Modal
                visible={isHealthSchemeDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setHealthSchemeDropdownVisible(false)}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  onPress={() => setHealthSchemeDropdownVisible(false)}>
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={healthSchemeData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => handleSelectHealthScheme(item)}>
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
              <Text style={styles.label}>Blood Group</Text>
              <TextInput
                style={styles.input}
                value={formData.bloodGroup}
                onChangeText={text => setFormData({ ...formData, bloodGroup: text })}
              />
               <Text style={styles.label}>UID No</Text>
              <TextInput
                style={styles.input}
                value={formData.uidno}
                onChangeText={text => setFormData({ ...formData, uidno: text })}
              />
              <Text style={styles.label}>Remarks</Text>
              <TextInput
                style={styles.input}
                value={formData.remarks}
                onChangeText={text => setFormData({ ...formData, remarks: text })}
              />

              <CustomButton
                title="Save"
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 10,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: grayColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  uploadIconContainer: {
    position: 'absolute',
    bottom: 2,
    right: -15,

    backgroundColor: greenColor,

    padding: 5,
    borderRadius: 15,
  },
  uploadButton: {
    marginTop: 5,
  },
  uploadText: {
    color: blackColor,
    fontSize: 14,
    margin: 10,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Skip_ProfiletoggleSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  searchSection: {
    width: '90%',
    marginBottom: 10,
  },
  formContainer: {
    width: '90%',
  },
  label: {
    fontSize: 14,
    color: grayColor,
    marginVertical: 5,
    fontFamily: fontFamily,
  },
  required: {
    color: 'red',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    height: 45,
  },

  inputError: {
    borderColor: 'red',
  },
  remarksInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 5,
    fontSize: 14,
    color: blackColor,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  submitContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  submitContainer: {
    marginTop: 20,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    maxHeight: 400, // Limit dropdown height
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
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
    width: '80%',
    height: 200, // Height of the modal
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
    backgroundColor: '#76d7c4',
    height: 50,
    width: 100,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AddFamily_member;
