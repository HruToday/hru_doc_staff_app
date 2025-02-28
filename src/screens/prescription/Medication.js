import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { greenColor } from '../../common/Color';
import CustomTag from '../../components/Custom_tag';
import CustomButton from '../../common/CustomButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Medicin_Model from '../../components/Medicin_Model';
import { AppContext } from '../../context _api/Context';
import { getallmedicinelist, getmedicinelist, medicineMappingList } from '../../api/authService';

const Medication = ({ route }) => {
  const appointmentId = route?.params?.appointmentId;
  
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState();
  const [medicationNotes, setMedicationNotes] = useState({});
  const { item,userdata, digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);
  const token = userdata?.data?.auth_token;
  const [data, setData] = useState([]);
  const [matchdata, setMatchdata] = useState([]);
  const [loading, setLoading] = useState(false); 

  const fetchData = async () => {
    setLoading(true);
    const response = await getmedicinelist({ token });
    
    
    setData(response.docs || []);
    setLoading(false);
  };

  useEffect(() => {
    const updatedMedicineIntake = item.medicineIntake?.map((medicine) => ({
      ...medicine,
      product_name: medicine.drug,  
    
    }));
  
    setSelectedValues(updatedMedicineIntake || []);
  }, [item]);
  
  
  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, [token]);


  useEffect(() => {
    let delay;
    if (inputValue.trim() !== '') {
      delay = setTimeout(async () => {
       
        try {
          const credentials = { token, keyword: inputValue };
          const response = await getallmedicinelist(credentials);
          if (response.msg === "Ok") {
            setData(response.docs);
            
          }
        } catch (error) {
          console.error('Error fetching searched medication:', error);
        }
      }, 500);
    } else {
    
      const fetchRecentMedication = async () => {
        try {
          const credentials = { token };
          const response = await getmedicinelist(credentials);
          setData(response.docs || []);
        } catch (error) {
          console.error('Error fetching recent medication', error);
        }
      };
      fetchRecentMedication();
    }

    return () => clearTimeout(delay); 
  }, [inputValue]);

  useEffect(() => {
    const credentials = { token: token };
    const fetchdata = async () => {
      const response = await medicineMappingList(credentials);
      console.log("mapingresponse",response);
      
      if (response.msg === "Ok") {
        setMatchdata(response.docs);
      }
    };
    fetchdata();
  }, [token]);


 
  useEffect(() => {
    if (!selectedValues.length && digital_Prescription[appointmentId]?.medications) {
    
      setSelectedValues(digital_Prescription[appointmentId]?.medications);
    }
  }, [appointmentId]); 
  
 
  
 
  useEffect(() => {
   
    if (selectedValues.length > 0) {
      Digtail_PrescriptionData(appointmentId, 'medications', selectedValues);
    }
  }, [selectedValues, appointmentId]);
 

  const handleDropdownSelection = (item) => {
    const isMatchingData = matchdata.find((med) => med.drug === item.product_name);

    if (isMatchingData) {
      const fullItem = { ...item, ...isMatchingData };
    
      

      setSelectedValues((prev) => {
        const exists = prev.some((med) => med.product_name === fullItem.product_name);
        return exists ? prev : [...prev, fullItem];
      });

      setModalVisible(false);
      setDropdownVisible(false);
      setInputValue('');
    } else {
      setSelectedMedication(item);
      setModalVisible(true);
      setDropdownVisible(false);
      setInputValue('');
    }
  };

  const handleAddMedication = (data) => {
    if (selectedMedication) {
      const newMedication = { ...selectedMedication, ...data };
      setSelectedValues((prev) => {
        const exists = prev.some((med) => med.product_name === newMedication.product_name);
        return exists ? prev.map((med) => (med.product_name === newMedication.product_name ? newMedication : med)) : [...prev, newMedication];
      });
      setMedicationNotes((prevNotes) => ({ ...prevNotes, [newMedication.product_name]: data.notes || '' }));
       setModalVisible(false);
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedValues((prev) => {
      const filtered = prev.filter((val) => val.product_name !== item.product_name);
      return filtered.length !== prev.length ? filtered : prev;
    });
  };

  const handleCustomTagSelection = (updatedSelection) => {
    updatedSelection.forEach((item) => {
      const isMatchingData = matchdata.find((med) => med.drug === item.product_name);

      if (isMatchingData) {
        const fullItem = { ...item, ...isMatchingData };
        const exists = selectedValues.some((med) => med.product_name === fullItem.product_name);
        if (!exists) {
          setSelectedValues((prev) => [...prev, fullItem]);
        }
      } else {
        const exists = selectedValues.some((med) => med.product_name === item.product_name);
        if (!exists) {
          setSelectedValues((prev) => [...prev, item]);
        }
      }

      if (updatedSelection.length > 0) {
        setSelectedMedication(updatedSelection[updatedSelection.length - 1]);
        const lastItem = updatedSelection[updatedSelection.length - 1];
        const lastItemMatch = matchdata.find((med) => med.drug === lastItem.product_name);
        setModalVisible(!lastItemMatch);
      }
    });
  };

  const handleEditItem = (item) => {
    setSelectedMedication(item);
    setModalVisible(true);
  };
 
 
  


  return (
    <View style={styles.container}>
      <Medicin_Model
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        saveData={handleAddMedication}
        selectedMedication={selectedMedication}
        selectedProductName={selectedMedication?.product_name}
      />
      <ScrollView style={{ marginBottom: 20 }} 
     
      >
        <View>
          <View style={{ backgroundColor: greenColor, padding: 5, height: 60 }}>
            <TextInput
              style={styles.input_box}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Search Medicine"
              onFocus={() => setDropdownVisible(true)}
            />
          </View>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              <ScrollView>
                {data.map((el, index) => (
                  <TouchableOpacity style={styles.dropdown_item} key={index} onPress={() => handleDropdownSelection(el)}>
                    <Text style={styles.dropdown_text}>{el.product_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={greenColor} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView nestedScrollEnabled={true} style={[styles.firstcontainer, { height: selectedValues.length >= 3 ? 250 : 'auto' }]}>
            {selectedValues.map((item, index) => (
              <View key={index} style={styles.infoContainer}>
                <TouchableOpacity onPress={() => handleCustomTagSelection([item])}>
                  <FontAwesome name="medkit" size={40} color="#4caf50" />
                </TouchableOpacity>
                <View style={styles.iconContainer}>
                  <Text style={styles.iconText}>{item.product_name}</Text>
                  <View style={styles.med_data}>
                    <Text style={styles.infoText}>{item.dosage}</Text>
                    <Text style={styles.infoText}> {item.unit} |</Text>
                    <Text style={styles.infoText}> {item.consumptionTime} |</Text>
                    <Text style={styles.infoText}> {item.frequency} |</Text>
                    <Text style={styles.infoText}> {item.duration}</Text>
                    <Text style={styles.infoText}>{item.time}</Text>
                    <Text style={styles.infoText}>{item.additionalNote && item.additionalNote.trim() !== '' ? ` | ${item.additionalNote}` : ''}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "column", gap: 5 }}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => handleRemoveItem(item)}>
                    <MaterialIcons name="close" size={15} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => handleEditItem(item)}>
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
          onPress={() => navigation.navigate('Procedures', { appointmentId: appointmentId})}
          title={'← Procedures'}
        />
        <CustomButton
          style={styles.rightButton}
          onPress={() => navigation.navigate('lab_test', { appointmentId: appointmentId })}
          title={'Lab Test →'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,
    backgroundColor:"white"
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
  dropdown_text: { fontSize: 14, color: '#333' },
  // firstcontainer:{
  //   height:250
  // },
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
    margin: 3

  },
  iconContainer: { flex: 1, paddingLeft: 10 },
  medicineIcon: {
    marginBottom: 8,
  },
  iconText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },

  medicineIcon: { marginBottom: 8 },
  med_data: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  leftButton: { backgroundColor: '#145d89',  borderRadius: 10, flex: 1, marginRight: 5 },
  rightButton: { backgroundColor: greenColor,   borderRadius: 10, flex: 1, marginLeft: 5 },

});

export default Medication;
