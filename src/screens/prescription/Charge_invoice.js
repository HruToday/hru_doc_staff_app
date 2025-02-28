import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import SecondHeader from '../../components/SecondHeader';
import {blackColor, greenColor, whiteColor} from '../../common/Color';
import CustomButton from '../../common/CustomButton';
import {useNavigation} from '@react-navigation/native';

const Charge_invoice = () => {
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <SecondHeader
        title="Charge & Invoice"
        showLocation={false}
        showSearch={false}
        topBarStyle={{justifyContent: 'flex-start'}}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Atul</Text>

        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked1 && styles.checkboxChecked]}
            onPress={() => setIsChecked1(!isChecked1)}>
            {isChecked1 && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Confirm invoic generation </Text>
        </View>

        <Text style={styles.label}>Enter Amount</Text>
        <TextInput style={styles.input} placeholder="Enter text here" />

        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={[styles.checkbox, isChecked2 && styles.checkboxChecked]}
            onPress={() => setIsChecked2(!isChecked2)}>
            {isChecked2 && <View style={styles.checkboxInner} />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            Are there any additional charge(s)?
          </Text>
        </View>

        <Text style={styles.label}>Enter Amount</Text>
        <TextInput style={styles.input} placeholder="Enter text here" />

        <Text style={styles.label}>Description </Text>
        <TextInput style={styles.input} placeholder="Enter text here" />

        <View style={styles.radioButtonContainer}>
          <TouchableOpacity style={styles.radioButton}>
            <View style={styles.radioInner} />
          </TouchableOpacity>
          <Text style={styles.radioText}>Patinet will pay directly to ME</Text>
        </View>

        <View style={styles.radioButtonContainer}>
          <TouchableOpacity style={styles.radioButton}>
            <View style={styles.radioInner} />
          </TouchableOpacity>
          <Text style={styles.radioText}>Patinet will pay directly to HRU</Text>
        </View>

        <View />
        <Text style={styles.blueSection}>
          Please check the notification for the receipt of payment by HRU else
          please collect cash.
        </Text>
        <View style={styles.buttonsContainer}>
          <CustomButton
            style={styles.leftButton}
            onPress={() => navigation.navigate('prescription')}
            title={'← Preview'}
          />
          <CustomButton
            style={styles.rightButton}
            title={'Submit '}
            onPress={() => console.log('done')}
          />
        </View>
      </View>
    </>
  );
};

export default Charge_invoice;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 12,
    height: 12,
    backgroundColor: '#007BFF',
    borderRadius: 50,
  },
  radioText: {
    fontSize: 16,
    marginLeft: 10,
  },
  blueSection: {
    height: 50,
    backgroundColor: 'lightblue',
    marginTop: 20,
    borderRadius: 5,
    color: blackColor,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 30,
    padding: 10,
  },
  leftButton: {
    backgroundColor: 'blue',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '50%',
  },
  rightButton: {
    backgroundColor: greenColor,
    // borderTopLeftRadius: 20,
    // borderBottomLeftRadius: 20,
    width: '50%',
  },
});
