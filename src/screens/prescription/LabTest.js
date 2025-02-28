import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../../context _api/Context';
import { getalllabtests, getlabtests, getRecentLabAttributes } from '../../api/authService';
import { greenColor } from '../../common/Color';
import CustomTag from '../../components/Custom_tag';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';

const LabTest = ({ route }) => {
  const { item, userdata, digital_Prescription, Digtail_PrescriptionData, } = useContext(AppContext);
  const appointmentId = route?.params?.appointmentId;

  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = userdata?.data?.auth_token;
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState();
  const [testNote, setTestNote] = useState('');
  const [testNotes, setTestNotes] = useState({});
  const [matchdata, setMatchdata] = useState([]);

  useEffect(() => {
    const handlefetch = async () => {
      setLoading(true);
      const credentials = { token };
      try {
        const response = await getlabtests(credentials);
        setData(response.recently_used || []);
      } catch (error) {
        console.error('Error fetching lab tests:', error);
      } finally {
        setLoading(false); 
      }
    };
    handlefetch();
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true); // Show spinner
      const credentials = { token };
      try {
        const response = await getRecentLabAttributes(credentials);
        setMatchdata(response.docs);
      } catch (error) {
        console.error('Error fetching lab attributes:', error);
      } finally {
        setLoading(false); // Hide spinner after data is fetched
      }
    };
    fetchdata();
  }, []);

  useEffect(() => {
    let delay;
    if (inputValue.trim() !== '') {

      delay = setTimeout(async () => {
        try {
          const credentials = { token, keyword: inputValue };
          const response = await getalllabtests(credentials);
          if (response.msg === 'Ok') {
            setData(response.docs);
          }
        } catch (error) {
          console.error('Error fetching searched lab tests:', error);
        }
      }, 500); // Debounce time (500ms)
    } else {
      // Reset data to recently used when input is cleared
      const fetchRecentLabTests = async () => {
        setLoading(true);
        try {
          const credentials = { token };
          const response = await getlabtests(credentials);
          setData(response.recently_used || []);
        } catch (error) {
          console.error('Error fetching recent lab tests:', error);
        } finally {
          setLoading(false); // Hide spinner after data is fetched
        }
      };
      fetchRecentLabTests();
    }

    return () => clearTimeout(delay); // Cleanup debounce timeout
  }, [inputValue]);

  // const handleDropdownSelection = (item) => {
  //   const normalizedItemName = item.product_name.trim().toLowerCase(); // Normalize by trimming and converting to lowercase
  //   const matchingItem = matchdata.find(
  //     (match) => match.value.trim().toLowerCase() === normalizedItemName // Normalize match data similarly
  //   );

  //   if (matchingItem) {
  //     // If there's a match, add directly to selectedValues
  //     setSelectedValues((prev) => [...prev, item]);
  //     setTestNotes((prevNotes) => ({ ...prevNotes, [item.product_name]: '' })); // No note needed for matching item
  //   } else {
  //     // If no match, open modal for adding note
  //     setSelectedTest(item);
  //     setTestNote('');
  //     setModalVisible(true);
  //   }
  //   setDropdownVisible(false);
  //   setInputValue('');
  // };

  const handleDropdownSelection = (item) => {
    // Ensure product_name is a valid string before using trim
    const normalizedItemName = item.product_name ? item.product_name.trim().toLowerCase() : '';

    const matchingItem = matchdata.find(
      (match) => match.value ? match.value.trim().toLowerCase() === normalizedItemName : false
    );

    if (matchingItem) {
      // If there's a match, add directly to selectedValues
      setSelectedValues((prev) => [...prev, item]);
      setTestNotes((prevNotes) => ({ ...prevNotes, [item.product_name]: '' })); // No note needed for matching item
    } else {
      // If no match, open modal for adding note
      setSelectedTest(item);
      setTestNote('');
      setModalVisible(true);
    }
    setDropdownVisible(false);
    setInputValue('');
  };
  useEffect(() => {
    const updated_labs = item.labs?.map((lab) => ({
            product_name: lab.testLabName,
        }));
         setSelectedValues(updated_labs||[])      
      }, [item]);
  
  
  useEffect(() => {
    if (digital_Prescription[appointmentId]?.labtest) {
      setSelectedValues(digital_Prescription[appointmentId]?.labtest);
    }
  }, [appointmentId]);
  useEffect(() => {
    if (selectedValues.length > 0) {

      Digtail_PrescriptionData(appointmentId, 'labtest', selectedValues);
    }
  }, [selectedValues]);

  const handleCustomTagSelection = (updatedSelection) => {
    setSelectedValues(updatedSelection);

    // Check for match in matchdata
    const selectedItem = updatedSelection[updatedSelection.length - 1];
    const normalizedSelectedName = selectedItem.product_name.trim().toLowerCase(); // Normalize by trimming and converting to lowercase
    const matchingItem = matchdata.find(
      (match) => match.value.trim().toLowerCase() === normalizedSelectedName // Normalize match data similarly
    );

    if (matchingItem) {
      setTestNotes((prevNotes) => ({ ...prevNotes, [selectedItem.product_name]: '' }));
    } else {
      setSelectedTest(selectedItem);
      setTestNote(testNotes[selectedItem.product_name] || '');
      setModalVisible(true);
    }
  };




  const handleAddLabTest = () => {
    if (selectedTest) {
      const newTest = { ...selectedTest };
      // Check if the test already exists in the selectedValues array
      if (!selectedValues.some((test) => test.product_name === newTest.product_name)) {
        setSelectedValues((prev) => [...prev, newTest]);
      }
      setTestNotes((prevNotes) => ({ ...prevNotes, [newTest.product_name]: testNote }));
      setModalVisible(false);
      setTestNote('');
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedValues((prev) => prev.filter((val) => val !== item));
  };

  const handleeditItem = (item) => {
    setSelectedTest(item);
    setTestNote(testNotes[item.product_name] || '');
    setModalVisible(true);
  };

 
  
  return (
    <View style={styles.container}>
      <ScrollView 
        
      >
        <View>
          <View style={{ backgroundColor: greenColor, padding: 5, height: 60 }}>
            <TextInput
              style={styles.input_box}
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              placeholderTextColor={greenColor}
              placeholder="Search Lab"
              onFocus={() => setDropdownVisible(true)}
            />
          </View>

          {dropdownVisible && (
            <View style={styles.dropdown}>
              <ScrollView>
                {data?.length > 0 ? (
                  data
                    .filter((el) =>
                      el.product_name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                    .map((el, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdown_item}
                        onPress={() => handleDropdownSelection(el)}
                      >
                        <Text style={styles.dropdown_text}>{el.product_name}</Text>
                      </TouchableOpacity>
                    ))
                ) : (
                  <TouchableOpacity
                    style={styles.dropdown_item}
                    onPress={() => handleDropdownSelection({ product_name: inputValue })}
                  >
                    <Text style={styles.dropdown_text}>
                      Add "{inputValue}"
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={greenColor} style={styles.loadingSpinner} />
        ) : (
          <ScrollView nestedScrollEnabled={true} style={[styles.firstcontainer, { height: selectedValues.length >= 4 ? 250 : 'auto' }]}>
            {selectedValues.map((item, index) => (
              <View style={styles.infoContainer} key={index}>
                <FontAwesome name="flask" size={40} color="#4caf50" style={styles.medicineIcon} />
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>{item.product_name}</Text>
                  <View style={styles.med_data}>
                    <Text style={styles.infoText}>{testNotes[item.product_name] || ''}</Text>
                  </View>
                </View>
                <View style={{ gap: 5 }}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => handleRemoveItem(item)}>
                    <MaterialIcons name="close" size={15} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => handleeditItem(item)}>
                    <MaterialIcons name="edit" size={15} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}


        <ScrollView nestedScrollEnabled={true} style={{ height: selectedValues.length >= 3 ? 350 : 'auto' }}>
          <CustomTag data={data} selectedItems={selectedValues} onSelectionChange={handleCustomTagSelection} />
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <CustomButton
          style={styles.leftButton}
          onPress={() => navigation.navigate('Medication', { appointmentId: appointmentId })}
          title={'← Medication'}
        />
        <CustomButton
          style={styles.rightButton}
          title={'Advice →'}
          onPress={() => navigation.navigate('Advice', { appointmentId: appointmentId })}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTest?.product_name}</Text>

            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle2}>Additional Notes</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter note (optional)"
              value={testNote}
              onChangeText={setTestNote}
            />
            <CustomButton title="Add Lab Test" onPress={handleAddLabTest} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LabTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  input_box: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    backgroundColor: 'white',
    margin: 5,
    paddingLeft: 10
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 250,
    zIndex: 1,
  },
  dropdown_item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdown_text: {
    fontSize: 14,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  iconContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  med_data: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  medicineIcon: {
    marginBottom: 8,
  },
  iconText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftButton: {
    backgroundColor: '#145d89',
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  rightButton: {
    backgroundColor: greenColor,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust for overlay color
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    position: 'relative', // For absolute positioning of close icon
  },
  closeModal: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalTitle2: {
    marginTop: 10,
    fontSize: 14,
  },
  modalInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
});