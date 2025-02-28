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
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
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
import SecondHeader from '../../components/SecondHeader';
import { AppContext } from '../../context _api/Context';
import {
  bookAppointmentNowPatient,
  fetchPatientList,
  savenewPatients,
} from '../../api/authService';
import PatientDetails_dropdown from '../../components/PatientDetails_dropdown';
import uuid from 'react-native-uuid';
import DateOfBirthCalculator from '../../components/DateCalculation';
import { Screen } from 'react-native-screens';
import AddressSearch from '../../components/Address';
import DropDowns from '../../components/DropDowns';

const AddPatients = ({ navigation }) => {


  const { refreshPage, userdata, selectedLocationId, booklaterData, updateFamilyDetails } = useContext(AppContext);
  const skipParentProfile = userdata?.data?.skipParentProfile;
  const uniqueId = uuid.v4();
  const [dob, setDob] = useState('');
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [ageDays, setAgeDays] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSkip, setIsSkip] = useState(skipParentProfile);
  const [date, setDate] = useState(new Date());
  const [child_date, child_SetDate] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [child_show, child_setShow] = useState(false);
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState('');
  const [child_gender, child_genderSetGender] = useState('');
  const [photo, setPhoto] = useState(null);
  const [childphoto, childSetPhoto] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [mobileResults, mobileSearchResults] = useState([]);
  const [isminor, setIsMinor] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    f_name: '',
    m_name: '',
    l_name: '',
    gender: '',
    profile_pic_image: '',
    email: '',
    remarks: '',
    dob: "",

  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const [debouncedMobileQuery, setDebouncedMobileQuery] = useState('');
  const defaultImageUrl =
    'https://beta.hru.today/patient/:673dc3a68223d1d1cded960a/673dc3a68223d1d1cded960c/display.image';

  const token = userdata?.data?.auth_token;
  const [selectedValue, setSelectedValue] = useState('--Select--');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const data = [
    'Son of',
    'Daughter of',
    'Brother of',
    'Sister of',
    'Grand Child of',
    'Other',
  ];
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  const handleSelect = value => {
    setSelectedValue(value);
    setDropdownVisible(false);
    setFormData({ ...formData, relationship: value });
  };
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
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== debouncedSearchQuery) {
        setDebouncedSearchQuery(searchQuery);
      }
      if (mobileQuery !== debouncedMobileQuery) {
        setDebouncedMobileQuery(mobileQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, mobileQuery]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const inputMedString = debouncedSearchQuery;
      const credentials = { token, inputMedString };

      const fetchData = async () => {
        try {
          const response = await fetchPatientList(credentials);
          if (response.status) {
            setSearchResults(response.docs);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        }
      };

      fetchData();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (debouncedMobileQuery) {
      const inputMedString = debouncedMobileQuery;
      const credentials = { token, inputMedString };

      const fetchData = async () => {
        try {
          const response = await fetchPatientList(credentials);
          if (response.status) {
            mobileSearchResults(response.docs);
          } else {
            mobileSearchResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
          mobileSearchResults([]);
        }
      };

      fetchData();
    } else {
      mobileSearchResults([]);
    }
  }, [debouncedMobileQuery]);

  const toggleSwitch = () => {
    setIsEnabled(prev => !prev);
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.f_name) {
      errors.f_name = 'First Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.f_name)) {
      errors.f_name = 'First Name should contain only letters';
    }

    // Validate Last Name
    if (!formData.l_name) {
      errors.l_name = 'Last Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.l_name)) {
      errors.l_name = 'Last Name should contain only letters';
    }

    // Validate Mobile
    if (!formData.mobile) {
      errors.mobile = 'Mobile Number is required';
    } else if (!/^\d+$/.test(formData.mobile)) {
      errors.mobile = 'Mobile Number must contain only numbers';
    }
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {

    const datevalue = formData.dob
    const dateParts = datevalue.split('/');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00Z`;
    formData.dob = formattedDate;




    if (!validateForm()) {
      return;
    }
    const credentials = { token, ...formData };




    try {
      const response = await savenewPatients(credentials);
      ;

      if (response.msg === 'Patient registered') {
        setFormData({
          mobile: '',
          f_name: '',
          m_name: '',
          l_name: '',
          gender: '',
          profile_pic_image: '',
          pprofile_pic_image: '',
          email: '',
          remarks: '',

          address: '',
          pf_name: '',
          pgender: '',
          pl_name: '',
          relationship: '',
        });
        setDob('');
        setAgeYears('')
        setAgeMonths('')
        setAgeDays('')
        setGender('');
        setPhoto(null)
        childSetPhoto(null)
        child_genderSetGender('');
        setSelectedHealthScheme('Select Health Scheme')
        setSelectedValue('--Select--');
        child_SetDate(new Date());
        setAddress("")
        setLoading(true);
        setTimeout(() => {
          setLoading(false); // Hide the loading indicator
          setResponseData(response.doc);
          booklaterData(response.doc._id, response.doc.profileId);
          setModalVisible(true); // Show the modal
        }, 1000);
      }
      else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePhotoPick = pickedPhoto => {
    setFormData({
      ...formData,
      profile_pic_image: pickedPhoto,
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
  const chilld_handlePhotoPick = pickedPhoto => {
    setFormData({
      ...formData,
      pprofile_pic_image: pickedPhoto,
    });
  };
  const child_handleChoosePhoto = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 600,
      compressImageQuality: 0.7,
      includeBase64: true,
    })
      .then(image => {
        const pickedPhoto = { uri: image.path };
        childSetPhoto(pickedPhoto);
        const forbase_64 = image.data;

        chilld_handlePhotoPick(forbase_64);
      })
      .catch(error => {
        console.error('Image picker error:', error);
        Alert.alert('Error', 'Failed to pick an image.');
      });
  };

  useEffect(() => {
    const parseDate = dob => {
      const [day, month, year] = dob.split('/');
      return `${year}-${month}-${day}`;
    };
    const calculateAge = dob => {
      if (!dob) return NaN;

      const formattedDob = parseDate(dob);
      const today = new Date();
      const birthDate = new Date(formattedDob);

      if (isNaN(birthDate)) {
        console.error('Invalid DOB format:', dob);
        return NaN;
      }

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    };
    const onDateChange = () => {
      if (dob) {
        const age = calculateAge(dob);


        if (!isNaN(age)) {
          if (age <= 18 && isSkip) {
            setIsMinor(false);
          }
          if (age <= 18 && !isSkip) {
            setIsMinor(true)
          }
          if (age > 18) {
            setIsMinor(false)
          }
        }


        setInputValue(dob);
        setFormData({ ...formData, dob });
      }
    }


    onDateChange();
  }, [dob, isSkip]);
  const child_onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || child_date;
    child_setShow(Platform.OS === 'ios');
    child_SetDate(currentDate);

    const formattedDate = currentDate.toISOString().split('T')[0] + "T00:00:00";

    setFormData({ ...formData, pdob: formattedDate });
  };



  const Skip_toggleSwitch = () => {
    setIsSkip(current => !current);
  };

  const bookNow = async () => {
    const credentials = {
      token: token,
      patientId: responseData._id,
      profileId: responseData.profileId,
      workAddressId: selectedLocationId,
      uid: uniqueId,
    };

    try {
      const response = await bookAppointmentNowPatient(credentials);
      if (response.msg === 'Slot booked successfully.') {

        setModalVisible(false);
        refreshPage(true);
        navigation.navigate('Work Queue', { screen: 'WorkQueueMain' });
      } else {
        Alert.alert(response.msg);
      }
    } catch (error) {
      console.log(error.massage);
    }
  };

  return (
    <>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, backgroundColor: lightbackground }}
      >
        <DropDowns/>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{


          }}
        >
          <View style={styles.container}>

            {isEnabled ? null : (
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
              </View>
            )}
            
            <Text style={styles.descriptionText}>
              Do you want to search your existiting HRU patient?
            </Text>
          

            <View style={styles.toggleSection}>
            <Text>NO</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
                <Text>Yes</Text>
            </View>

            {isEnabled ? (
              <View style={styles.searchSection}>

                <TextInput
                  style={[styles.input, { width: 350 }]}
                  placeholder="Search patient by name or mobile No."
                  placeholderTextColor={"gray"}
                  value={searchQuery}
                  onChangeText={text => setSearchQuery(text)}
                />

                {searchResults.length > 0 && (
                  <PatientDetails_dropdown
                    data={searchResults.map(result => ({
                      label: `${result.firstName} ${result.middleName || ''} ${result.lastName
                        }`.trim(), // Display full name as label
                      mobile_no: result.mobileNumber, // Display mobile number
                      profile_pic: result?.imgUrl?.path
                        ? `https://beta.hru.today/show-uploaded.image?path=${result.imgUrl.path}`
                        : 'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
                      value: result, // Keep the full result for selecting purposes
                    }))}
                    onSelect={selectedItem => {
                      setSearchQuery('');
                      navigation.navigate('My Patients', {
                        screen: 'info_booking',
                        params: { selectedItem }
                      });

                    }}
                    style={styles.customDropdown}
                  />
                )}
              </View>
            ) : (
              <View style={styles.formContainer}>
                {[
                  {
                    label: 'Mobile Number',
                    key: 'mobile',
                    keyboardType: 'numeric',
                    maxLength: 10,

                  },
                  { label: 'First Name', key: 'f_name' },
                  { label: 'Middle Name', key: 'm_name' },
                  { label: 'Last Name', key: 'l_name' },
                  { label: 'Email', key: 'email', keyboardType: 'email-address' },
                ].map(({ label, key, ...props }) => (
                  <View key={key}>
                    <Text style={styles.label}>
                      {label}
                      {key !== 'email' && key !== 'm_name' ? (
                        <Text style={styles.required}>*</Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        formErrors[key] && styles.inputError,
                      ]}
                      value={formData[key]}
                      onChangeText={text => {
                        setFormData({ ...formData, [key]: text });
                        setFormErrors({ ...formErrors, [key]: '' });
                        if (key === 'mobile' && text.length === 10) {
                          setMobileQuery(text);
                        } else {
                          setMobileQuery("");
                        }
                      }}
                      {...props}
                    />

                    {/* Show error text for current field */}
                    {formErrors[key] && (
                      <Text style={styles.errorText}>{formErrors[key]}</Text>
                    )}

                    {/* Show dropdown only below the Mobile Number input */}
                    {key === 'mobile' && mobileResults.length > 0 && (
                      <PatientDetails_dropdown
                        data={mobileResults.map(result => ({
                          label: `${result.firstName} ${result.middleName || ''
                            } ${result.lastName}`.trim(),
                          mobile_no: result.mobileNumber,
                          profile_pic: result?.imgUrl?.path
                            ? `https://beta.hru.today/show-uploaded.image?path=${result.imgUrl.path}`
                            : 'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
                          value: result,
                        }))}
                        onSelect={selectedItem => {
                          setFormData(prev => ({ ...prev, mobile: '' }));
                          setMobileQuery('')
                          updateFamilyDetails({
                            _id: selectedItem.value._id,
                            patient_id: selectedItem.value.profileId,
                          });

                          navigation.navigate('My Patients', { screen: 'FamilyMembers' });
                        }}
                        style={styles.customDropdown}
                      />
                    )}
                  </View>
                ))}


                <DateOfBirthCalculator dob={dob} setDob={setDob} ageYears={ageYears}
                  setAgeYears={setAgeYears} ageMonths={ageMonths} setAgeMonths={setAgeMonths}
                  ageDays={ageDays} setAgeDays={setAgeDays}
                />

                <Text style={styles.label}>
                  Gender <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.radioGroup}>
                  {['male', 'female'].map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.radioOption}
                      onPress={() => {
                        const genderValue = index === 0 ? "male" : "female"; // Set 0 for "male", 1 for "female"
                        setGender(option);
                        setFormData({ ...formData, gender: genderValue });
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
                {formErrors.gender && (
                  <Text style={styles.errorText}>{formErrors.gender}</Text>
                )}

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
                <Text style={styles.label}>Address</Text>
                <GooglePlacesAutocomplete
                  placeholder="Search for a place"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setAddress(data.description);
                    setFormData({
                      ...formData, addressLineOne: data.description, location: {
                        longitude: details.geometry.location.lat,
                        latitude: details.geometry.location.lng
                      }
                    });
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
                <Text style={styles.label}>UID No</Text>
                <TextInput
                  style={styles.input}
                  value={formData.UIDNo}
                  onChangeText={text =>
                    setFormData({ ...formData, UIDNo: text })
                  }
                />
                <Text style={styles.label}>Blood Group </Text>
                <TextInput
                  style={styles.input}
                  value={formData.BloodGroup}
                  onChangeText={text =>
                    setFormData({ ...formData, BloodGroup: text })
                  }
                />
                <Text style={styles.label}>Remarks</Text>
                <TextInput
                  style={styles.input}
                  value={formData.remarks}
                  onChangeText={text =>
                    setFormData({ ...formData, remarks: text })
                  }
                />

                <View style={styles.Skip_ProfiletoggleSection}>
                  <Text>Skip Parent Profile</Text>
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isSkip ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={Skip_toggleSwitch}
                    value={isSkip}
                  />
                </View>

                {/* Child Data */}
                {isminor && (
                  <View>
                    <Text>
                      Parent Profile (Since the patient is minor, parent
                      information is required)
                    </Text>
                    <View style={styles.photoSection}>
                      <View style={styles.photoContainer}>
                        {childphoto ? (
                          <Image
                            source={childphoto}
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
                        onPress={child_handleChoosePhoto}>
                        <View style={styles.uploadIconContainer}>
                          <Icon name="cloud-upload" size={25} color="white" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>
                      Select patient relationship with guardian
                    </Text>
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
                        onPress={() => setDropdownVisible(false)} // Close when tapping outside
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
                    {[
                      { label: 'Parent First Name', key: 'pf_name' },
                      { label: 'Parent Last Name', key: 'pl_name' },
                    ].map(({ label, key, ...props }) => (
                      <View key={key}>
                        <Text style={styles.label}>
                          {label}
                          <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            formErrors[key] && styles.inputError,
                          ]}
                          value={formData[key]}
                          onChangeText={text => {
                            setFormData({ ...formData, [key]: text });
                            setFormErrors({ ...formErrors, [key]: '' });
                          }}
                          {...props}
                        />

                        {formErrors[key] && (
                          <Text style={styles.errorText}>
                            {formErrors[key]}
                          </Text>
                        )}
                      </View>
                    ))}

                    <Text style={styles.label}>Parent Age</Text>

                    <View style={styles.dateInput}>
                      <Text style={styles.dateText}>
                        {child_date.toDateString()}
                      </Text>
                      <TouchableOpacity onPress={() => child_setShow(true)}>
                        <Icon name="calendar" size={25} color={greenColor} />
                      </TouchableOpacity>
                    </View>
                    {child_show && (
                      <DateTimePicker
                        value={child_date}
                        mode="date"
                        display="default"
                        onChange={child_onDateChange}
                      />
                    )}

                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.radioGroup}>
                      {['male', 'female'].map((option, index) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.radioOption}
                          onPress={() => {
                            const genderValue = index === 0 ? "male" : "female";  // Set 0 for "male", 1 for "female"
                            child_genderSetGender(option);
                            setFormData({ ...formData, pgender: genderValue });
                          }}>
                          <Icon
                            name={
                              child_gender === option
                                ? 'dot-circle-o'
                                : 'circle-o'
                            }
                            size={20}
                            color={greenColor}
                          />
                          <Text style={styles.radioText}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {/* <Text style={styles.label}>Address</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.address}
                      onChangeText={text =>
                        setFormData({ ...formData, address: text })
                      }
                    /> */}
                  </View>
                )}
                <View
                  style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {loading && (
                    <ActivityIndicator size={70} color={greenColor} />
                  )}
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.title}>
                        Patient added successfully. Do you want to book an
                        appointment?
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          gap: 10,
                        }}>
                        <TouchableOpacity
                          style={[styles.button]}
                          onPress={() => {
                            setModalVisible(false);
                          }}>
                          <Text style={styles.buttonText}>Add More</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => {
                            bookNow();
                          }}>
                          <Text style={styles.buttonText}>Book Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('add_appointment');
                          }}>
                          <Text style={styles.buttonText}>Book Later</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>

                <View>
                  <CustomButton
                    title="Add Patient"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f9f9f9', marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 20,
    alignItems: "center"

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
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Skip_ProfiletoggleSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    width: '100%',
  },
  searchSection: {
    width: '90%',
    height: 600,
    margin: 10,
    backgroundColor: '#f9f9f9'
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
    width: 80,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AddPatients;
