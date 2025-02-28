import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { fontFamily, grayColor, greenColor } from "../common/Color";

const DateOfBirthCalculator = ({ dob,
  setDob,ageYears, setAgeYears,ageMonths, setAgeMonths,ageDays, setAgeDays}) => {
  
  
  
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setAgeYears(years.toString());
    setAgeMonths(months.toString());
    setAgeDays(days.toString());
  };

  const updateDOBFromAge = (years, months, days) => {
    const today = new Date();
    const calculatedDate = new Date(
      today.getFullYear() - parseInt(years || 0),
      today.getMonth() - parseInt(months || 0),
      today.getDate() - parseInt(days || 0)
    );

    const formattedDate = calculatedDate
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/"); // Format DD/MM/YYYY
    setDob(formattedDate);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowPicker(false);
    const formattedDate = currentDate
      .toISOString()
      .split("T")[0]
      .split("-")
      .reverse()
      .join("/"); // Format DD/MM/YYYY
    setDob(formattedDate);
    calculateAge(formattedDate.split("/").reverse().join("-"));
  };

  const formatDobInput = (input) => {
    if (input.length === 2 || input.length === 5) {
      if (dob.length < input.length) {
        input += "/";
      }
    }
    setDob(input);

    if (input.length === 10) {
      const formattedInput = input.split("/").reverse().join("-");
      calculateAge(formattedInput);
    }
  };

  const handleAgeChange = (type, value) => {
    if (type === "years") {
      setAgeYears(value);
      updateDOBFromAge(value, ageMonths, ageDays);
    } else if (type === "months") {
      setAgeMonths(value);
      updateDOBFromAge(ageYears, value, ageDays);
    } else if (type === "days") {
      setAgeDays(value);
      updateDOBFromAge(ageYears, ageMonths, value);
    }
  };


  return (
    <View style={styles.container}>
       <Text style={styles.label}>
       Date of Birth / Age <Text style={styles.required}>*</Text>
                      </Text>
       
      <View style={styles.dateInput}>
        <TextInput
          placeholder="DD/MM/YYYY"
          value={dob}
          onChangeText={formatDobInput}
          keyboardType="numeric"
          maxLength={10}
        />
        <TouchableOpacity style={{marginRight:5}} onPress={() => setShowPicker(true)}>
          <Icon name="calendar" size={25} color={greenColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.ageContainer}>
        <View>
          <Text style={styles.label}>Age years</Text>
          <TextInput
            value={ageYears}
            onChangeText={(text) => handleAgeChange("years", text)}
            keyboardType="numeric"
            maxLength={2}
            style={styles.input}
          />
        </View>
        <View>
          <Text style={styles.label}>Age months</Text>
          <TextInput
            value={ageMonths}
            onChangeText={(text) => handleAgeChange("months", text)}
            keyboardType="numeric"
            maxLength={2}
            style={styles.input}
          />
        </View>
        <View>
          <Text style={styles.label}>Age days</Text>
          <TextInput
            value={ageDays}
            onChangeText={(text) => handleAgeChange("days", text)}
            keyboardType="numeric"
            maxLength={3}
            style={styles.input}
          />
        </View>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 14,
  },
  required: {
    color: 'red',
    fontSize: 14,
  },
  label: {
      fontSize: 14,
      color: grayColor,
      marginVertical: 5,
      fontFamily: fontFamily,
    },
  ageContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-around",
  },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    padding: 8,
    textAlign: "center",
  },
});

export default DateOfBirthCalculator;
