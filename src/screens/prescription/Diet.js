import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { greenColor, redColor } from '../../common/Color'; // Assume redColor is defined
import CustomButton from '../../common/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context _api/Context';
import { fetchDietTags } from '../../api/authService';
import { debounce } from 'lodash'; // import debounce function

const Diet = ({ route }) => {
  const appointmentId = route?.params?.appointmentId;
  const navigation = useNavigation();
  const { selectedTags,
    Selected_Tag, item, userdata, digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);
  const token = userdata?.data?.auth_token;
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [avoidInput, setAvoidInput] = useState('');
  const [consumeInput, setConsumeInput] = useState('');
  const [avoidValues, setAvoidValues] = useState([]);
  const [consumeValues, setConsumeValues] = useState([]);
  const [avoidDropdownVisible, setAvoidDropdownVisible] = useState(false);
  const [consumeDropdownVisible, setConsumeDropdownVisible] = useState(false);
  const [data, setData] = useState([]);


  const prevAvoidValuesRef = useRef([]);
  const prevConsumeValuesRef = useRef([]);
  const prevIsCheckedRef = useRef(false);

  // Fetch diet tags
  useEffect(() => {
    const handleFetch = async () => {
      setLoading(true);
      const credentials = { token: token };
      const response = await fetchDietTags(credentials);
      if (response.msg === "Ok") {
        setData(response.diet_tag_list);
      }
      setLoading(false);
    };
    handleFetch();
  }, [token]);

  // Set initial diet data from the item
  useEffect(() => {
    if (digital_Prescription[appointmentId]) {


      const avoidValues = item.dietToAvoid || [];
      const consumeValues = item.dietToConsume || [];
      const isChecked = item.isChecked || false; // Add a check for isChecked

      Digtail_PrescriptionData(appointmentId, "diet", {
        avoid: avoidValues,
        consume: consumeValues,
        chek: isChecked
      });
    }
  }, [appointmentId]);


  // Fetch saved values from digital_Prescription
  useEffect(() => {
    if (digital_Prescription[appointmentId]?.diet) {
      setAvoidValues(digital_Prescription[appointmentId]?.diet.avoid || []);
      setConsumeValues(digital_Prescription[appointmentId]?.diet.consume || []);
      setIsChecked(digital_Prescription[appointmentId]?.diet.chek || false);
    }
  }, [appointmentId,]);

  // Update digital prescription when avoidValues or consumeValues change
  useEffect(() => {
    if (prevAvoidValuesRef.current.length !== avoidValues.length) {
      Digtail_PrescriptionData(appointmentId, 'diet', { avoid: avoidValues, consume: consumeValues, chek: isChecked });
    }
    prevAvoidValuesRef.current = avoidValues;
  }, [avoidValues, appointmentId]);

  useEffect(() => {
    if (prevConsumeValuesRef.current.length !== consumeValues.length) {
      Digtail_PrescriptionData(appointmentId, 'diet', { avoid: avoidValues, consume: consumeValues, chek: isChecked });
    }
    prevConsumeValuesRef.current = consumeValues;
  }, [consumeValues, appointmentId]);

  useEffect(() => {
    if (prevIsCheckedRef.current !== isChecked) {
      Digtail_PrescriptionData(appointmentId, 'diet', { avoid: avoidValues, consume: consumeValues, chek: isChecked });
    }
    prevIsCheckedRef.current = isChecked;
  }, [isChecked, appointmentId]);

  const memoizedAvoidValues = useMemo(() => avoidValues, [avoidValues]);
  const memoizedConsumeValues = useMemo(() => consumeValues, [consumeValues]);

  const handleAvoidInputChange = (text) => {
    setAvoidInput(text);
    setAvoidDropdownVisible(text.length > 0);
  };

  const handleConsumeInputChange = (text) => {
    setConsumeInput(text);
    setConsumeDropdownVisible(text.length > 0);
  };

  const handleAddAvoid = useCallback(() => {
    if (avoidInput && !avoidValues.includes(avoidInput)) {
      setAvoidValues((prev) => [...prev, avoidInput]);
      setAvoidInput('');
      setAvoidDropdownVisible(false);
    }
  }, [avoidInput, avoidValues]);

  const handleAddConsume = useCallback(() => {
    if (consumeInput && !consumeValues.includes(consumeInput)) {
      setConsumeValues((prev) => [...prev, consumeInput]);
      setConsumeInput('');
      setConsumeDropdownVisible(false);
    }
  }, [consumeInput, consumeValues]);

  const handleUnselectAvoid = useCallback((value) => {
    setAvoidValues((prev) => prev.filter((item) => item !== value));
  }, []);

  const handleUnselectConsume = useCallback((value) => {
    setConsumeValues((prev) => prev.filter((item) => item !== value));
  }, []);

  const handlePress = useCallback((item) => {
    const newSelectedTags = selectedTags.includes(item.problem)
      ? selectedTags.filter(tag => tag !== item.problem)
      : [...selectedTags, item.problem];

    const newAvoidValues = avoidValues.includes(item.avoid)
      ? avoidValues.filter(avoid => avoid !== item.avoid)
      : [...avoidValues, item.avoid];

    const newConsumeValues = consumeValues.includes(item.consume)
      ? consumeValues.filter(consume => consume !== item.consume)
      : [...consumeValues, item.consume];

    Selected_Tag(newSelectedTags);
    setAvoidValues(newAvoidValues);
    setConsumeValues(newConsumeValues);
  }, [selectedTags, avoidValues, consumeValues]);

  return (
    <View style={styles.container}>
      {loading ? (<ActivityIndicator size="large" color={greenColor} style={styles.loadingSpinner} />)
        : (
          <ScrollView>
            <View style={styles.row_container}>
              <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox_container}>
                <MaterialCommunityIcons
                  name={isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={greenColor}
                />
              </TouchableOpacity>
              <Text style={styles.checkbox_label}>Consult a Dietitian?</Text>
            </View>

            {/* Diet to Avoid */}
            <View style={styles.input_group}>
              <Text style={styles.label}>Diet to Avoid</Text>
              <View style={styles.input_box_with_tags}>
                {memoizedAvoidValues.map((value, index) => (
                  <View key={index} style={styles.inline_tag}>
                    <Text style={styles.inline_tag_text}>{value}</Text>
                    <TouchableOpacity onPress={() => handleUnselectAvoid(value)} style={styles.unselect_button}>
                      <Text style={styles.unselect_button_text}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={styles.input_box}
                  value={avoidInput}
                  onChangeText={handleAvoidInputChange}

                  placeholderTextColor="#aaa"
                />
              </View>
              {avoidDropdownVisible && avoidInput.length > 0 && (
                <TouchableOpacity onPress={handleAddAvoid} style={styles.dropdown_item}>
                  <Text style={styles.dropdown_text}>Add "{avoidInput}"</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Diet to Consume */}
            <View style={styles.input_group}>
              <Text style={styles.label}>Diet to Consume</Text>
              <View style={styles.input_box_with_tags}>
                {memoizedConsumeValues.map((value, index) => (
                  <View key={index} style={styles.inline_tag}>
                    <Text style={styles.inline_tag_text}>{value}</Text>
                    <TouchableOpacity onPress={() => handleUnselectConsume(value)} style={styles.unselect_button}>
                      <Text style={styles.unselect_button_text}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TextInput
                  style={styles.input_box}
                  value={consumeInput}
                  onChangeText={handleConsumeInputChange}

                  placeholderTextColor="#aaa"
                />
              </View>
              {consumeDropdownVisible && consumeInput.length > 0 && (
                <TouchableOpacity onPress={handleAddConsume} style={styles.dropdown_item}>
                  <Text style={styles.dropdown_text}>Add "{consumeInput}"</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.addedValuesContainer}>
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.data_button, selectedTags.includes(item.problem) && styles.selected_button]}
                  onPress={() => handlePress(item)}
                >
                  <Text style={[styles.data_button_text, selectedTags.includes(item.problem) && styles.selected_button_text]}>
                    {item.problem}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      <View style={styles.buttonsContainer}>
        <CustomButton
          style={styles.leftButton}
          onPress={() => navigation.navigate('Advice', { appointmentId: appointmentId })}
          title={'← Advice'}
        />
        <CustomButton
          style={styles.rightButton}
          title={'Follow up →'}
          onPress={() => navigation.navigate('FollowUp', { appointmentId: appointmentId })}
        />
      </View>
    </View>
  );
};

export default Diet;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, margin: 10, borderRadius: 8, backgroundColor: '#fff' },
  row_container: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkbox_container: { marginRight: 8 },
  checkbox_label: { fontSize: 16, color: greenColor, fontWeight: '500' },
  input_group: { marginBottom: 16 },
  label: { fontSize: 14, color: '#555', marginBottom: 8, fontWeight: '600' },

  input_box_with_tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    height: "auto"
  },
  inline_tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  inline_tag_text: { fontSize: 14, color: '#00796b' },
  unselect_button: {
    marginLeft: 6,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselect_button_text: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  input_box: { flex: 1, fontSize: 16, paddingVertical: 0, paddingHorizontal: 5, minHeight: 40 },
  dropdown_item: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  dropdown_text: { fontSize: 14, color: '#333' },
  addedValuesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  buttonsContainer: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  leftButton: { backgroundColor: '#145d89',   borderRadius: 10, flex: 1, marginRight: 5 },
  rightButton: { flex: 1, marginLeft: 5 ,  borderRadius: 10,},
  data_button: { margin: 5, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#f2f3f4", borderRadius: 5 },
  selected_button: { backgroundColor: greenColor },
  data_button_text: { fontSize: 14, color: '#333' },
  selected_button_text: { color: '#fff' },
});
