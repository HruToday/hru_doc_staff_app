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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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

import { AppContext } from '../../context _api/Context';
import { mypatientgeninfo, updatePatientDetails } from '../../api/authService';

import uuid from 'react-native-uuid';
import DateOfBirthCalculator from '../../components/DateCalculation';
import AddressSearch from '../../components/Address';

const EditProfile = ({ navigation, route }) => {
  const {
    userdata,
    selectedLocationId,
    patientFamily_id,
    updateSelectedPatient,
  } = useContext(AppContext);
  const uniqueId = uuid.v4();

  const { selectedItem } = route.params;
  console.log(selectedItem);
  

  const [gender, setGender] = useState('');
  const [inputputValue, setinputputValue] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [defaultImageUrl, setDefaultImageUrl] = useState('');
  const [dob, setDob] = useState('');
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [ageDays, setAgeDays] = useState("");
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    PATIENT_UPDATE: '',
    uidNo: uniqueId,
    bloodGroup: '',
    remarks: '',
    dob: dob,
    addressLineOne: '',
    _id: selectedItem.value._id,
    profileId: selectedItem.value.profileId,
    workAddressId: selectedLocationId,
  });


  const [formErrors, setFormErrors] = useState({});

  const token = userdata?.data?.token;
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  const [isHealthSchemeDropdownVisible, setHealthSchemeDropdownVisible] =
    useState(false);
  const [selectedHealthScheme, setSelectedHealthScheme] = useState(
    'Select Health Scheme',
  );

  const healthSchemeData = ['--Select--', 'RGHS', 'ECLSH'];
  const handleSelectHealthScheme = item => {
    setSelectedHealthScheme(item);
    setHealthSchemeDropdownVisible(false);
    setFormData({ ...formData, healthScheme: item });
  };

  const handleSubmit = async () => {
    if (!dob) {
      Alert.alert("Error", "Date of Birth is required");
      return;
    }

    // Ensure dob is in the expected format before formatting
    if (dob.includes('-')) {
      // Already formatted correctly (DD-MM-YYYY)
      const dateParts = dob.split('-');
      formData.dob = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00Z`;
    } else if (dob.includes('/')) {
      // Convert MM/DD/YYYY to YYYY-MM-DD format
      const dateParts = dob.split('/');
      formData.dob = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00Z`;
    } else {
      Alert.alert("Error", "Invalid Date Format");
      return;
    }

    setFormData({
      ...formData,
      dob: formData.dob,
      relationship: inputputValue.relationship,
    });

    const credentials = {
      token,
      formData: formData,
    };
console.log(credentials);


    try {
      const response = await updatePatientDetails(credentials);
      console.log("response",response);
      
      if (response.msg === 'Ok') {
        updateSelectedPatient({
          _id: selectedItem.value._id,
          patient_id: selectedItem.value.profileId,
        });
        navigation.navigate('Details');
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  const handlePhotoPick = pickedPhoto => {
    setFormData({
      ...formData,
      PATIENT_UPDATE: 'data:image/png;base64,' + pickedPhoto,
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

  useEffect(() => {
    const fetchdata = async () => {
      const credentials = {
        token,
        _id: selectedItem.value._id,
        patientId: selectedItem.value.profileId,
        doctorIds: userdata?.data?.doctorIds,
        "doctorId": "ALL",
      };
    
     console.log("credentials",credentials);
     

      const response = await mypatientgeninfo(credentials);
      console.log("response",response);
      



      setinputputValue(response.doc);
    };

    fetchdata();
  }, []);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      dob: dob,
    }));
  }, [dob]);
  useEffect(() => {
    if (inputputValue) {
      const genderValue = inputputValue.gender?.toLowerCase();
      const dobValue = inputputValue.dob;

      const formattedDob = formatDate(dobValue)

      setDob(formattedDob)
      setFormData(prevFormData => ({
        ...prevFormData,
        firstName: inputputValue.firstName || '',
        middleName: inputputValue.middleName || '',
        lastName: inputputValue.lastName || '',
        gender: genderValue || '',
        uidNo: uniqueId,
        bloodGroup: inputputValue.bloodGroup || '',
        dob: formattedDob,
        Emails: inputputValue.email,
        remarks: inputputValue.remarks
      }));
      setGender(genderValue || '');
      setAgeYears(String(inputputValue?.age?.years || ''))
      setAgeMonths(String(inputputValue?.age?.months || ''))
      setDefaultImageUrl(inputputValue.imgPath || '');
      setSelectedHealthScheme(inputputValue.healthScheme)


    }
  }, [inputputValue]);



  return (
    <>


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1,backgroundColor: lightbackground  }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* Photo Section */}
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                {photo ? (
                  <Image source={photo} style={styles.photo} resizeMode="cover" />
                ) : (
                  <Image source={{ uri: defaultImageUrl }} style={styles.photo} resizeMode="cover" />
                )}
              </View>
              <TouchableOpacity style={styles.uploadButton} onPress={handleChoosePhoto}>
                <View style={styles.uploadIconContainer}>
                  <Icon name="cloud-upload" size={25} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {[
                { label: 'First Name', key: 'firstName' },
                { label: 'Middle Name', key: 'middleName' },
                { label: 'Last Name', key: 'lastName' },
                { label: 'Blood Group', key: 'bloodGroup' },
                { label: 'UID No', key: 'uidno' },
              ].map(({ label, key }) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, formErrors[key] && styles.inputError]}
                    value={formData[key]}
                    onChangeText={text => {
                      setFormData({ ...formData, [key]: text });
                      setFormErrors({ ...formErrors, [key]: '' });
                    }}
                  />
                  {formErrors[key] && <Text style={styles.errorText}>{formErrors[key]}</Text>}
                </View>
              ))}

              {/* Health Scheme Dropdown */}
              <Text style={styles.label}>Health Scheme</Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setHealthSchemeDropdownVisible(true)}>
                <Text style={styles.selectedText}>{selectedHealthScheme}</Text>
              </TouchableOpacity>
              <Modal
                visible={isHealthSchemeDropdownVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setHealthSchemeDropdownVisible(false)}
              >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setHealthSchemeDropdownVisible(false)}>
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={healthSchemeData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelectHealthScheme(item)}>
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>

              {/* Date of Birth Calculator */}
              <DateOfBirthCalculator dob={dob} setDob={setDob} ageYears={ageYears} setAgeYears={setAgeYears} ageMonths={ageMonths} setAgeMonths={setAgeMonths} ageDays={ageDays} setAgeDays={setAgeDays} />

              {/* Gender Selection */}
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioGroup}>
                {['male', 'female'].map(option => (
                  <TouchableOpacity key={option} style={styles.radioOption} onPress={() => setGender(option)}>
                    <Icon name={gender === option ? 'dot-circle-o' : 'circle-o'} size={20} color={greenColor} />
                    <Text style={styles.radioText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Address Search */}
              <Text style={styles.label}>Address</Text>
              <GooglePlacesAutocomplete
                placeholder="Search for a place"
                fetchDetails={true}
                onPress={(data, details = null) => {
                  setAddress(data.description);
                  setFormData({ ...formData, addressLineOne: data.description,mapLocation:{
                    longitude:details.geometry.location.lat,
                    latitude:details.geometry.location.lng
                  } });
                  if (details?.geometry?.location) {
                    setLatitude(details.geometry.location.lat);
                    setLongitude(details.geometry.location.lng);
                  }
                }}
                query={{
                  key: 'AIzaSyCJbnxIUqkQQE99IB4Ffg90k4cQ6wcf068',
                  language: 'en',
                }}
                styles={{
                  textInput: {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 10,
                    fontSize: 14,
                    height: 45,
                  },
                  listView: {
                    backgroundColor: 'white',
                    zIndex: 1000,
                    elevation: 5,
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                keyboardShouldPersistTaps="handled"
              />

              {/* Other Fields */}
              <Text style={styles.label}>Remark</Text>
              <TextInput style={styles.input} value={formData.remarks} onChangeText={text => setFormData({ ...formData, remarks: text })} />

              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} value={formData.Emails} onChangeText={text => setFormData({ ...formData, Emails: text })} />
            </View>
            <View>
              <CustomButton title="Save" onPress={handleSubmit} style={{ width: "100%" }} />
            </View>
          </View>

        </ScrollView>

        {/* Save Button */}

      </KeyboardAvoidingView>

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

    padding: 20
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

export default EditProfile;
