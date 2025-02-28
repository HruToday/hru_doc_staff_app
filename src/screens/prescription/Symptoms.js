import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import SecondHeader from '../../components/SecondHeader';
import CustomTag from '../../components/Custom_tag';
import Icon from 'react-native-vector-icons/Ionicons';
import {greenColor, whiteColor} from '../../common/Color';
import CustomButton from '../../common/CustomButton';
import {useNavigation} from '@react-navigation/native';

const Symptoms = () => {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const data = [
    'Flu',
    'Cold',
    'COVID-19',
    'Malaria',
    'Tuberculosis',
    'Fever',
    'Fever',
    'Chickenpox',
    'Asthma',
  ];
  const data2 = [
    'Flu',
    'Cold',
    'COVID-19',
    'Malaria',
    'Tuberculosis',
    'Fever',
    'Chickenpox',
    'Asthma',
    'Diabetes',
    'Hypertension',
    'Migraine',
    'Pneumonia',
  ];
  const clearInput = () => {
    setText('');
  };

  const renderContent = () => (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Atul</Text>
        <View style={styles.area_container}>
          <Text style={styles.title}>Add Symptoms</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Enter notes here..."
              value={text}
              onChangeText={setText}
              multiline
            />
            {text ? (
              <TouchableOpacity style={styles.closeIcon} onPress={clearInput}>
                <Icon name="close" size={20} color="#888" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.tagsContainer}>
          <CustomTag name="Recently Used" data={data} />
        </View>

        <View style={styles.commonly_tagsContainer}>
          {/* <CustomTag name="Commonly Used" data={data2} /> */}
        </View>

        <View style={styles.buttonsContainer}>
          <CustomButton
            style={styles.leftButton}
            onPress={() => navigation.navigate('vitals')}
            title={'← Preview'}
          />
          <CustomButton
            style={styles.rightButton}
            title={'Medication →'}
            onPress={() => navigation.navigate('medication')}
          />
        </View>
      </View>
    </>
  );

  return (
    <>
      {/* <SecondHeader
        title="Atul"
        showLocation={true}
        showSearch={false}
        topBarStyle={{justifyContent: 'space-between'}}
      /> */}
      <FlatList
        data={[{key: 'content'}]}
        renderItem={renderContent}
        keyExtractor={item => item.key}
      />
    </>
  );
};

export default Symptoms;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  area_container: {
    padding: 20,
    backgroundColor: whiteColor,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    paddingRight: 40,
    lineHeight: 20,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  closeIcon: {
    position: 'absolute',
    top: '50%',
    right: 10,
    transform: [{translateY: -10}],
  },

  commonly_tagsContainer: {
    backgroundColor: whiteColor,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 5,
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
