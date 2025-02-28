import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {
  blackColor,
  grayColor,
  greenColor,
  whiteColor,
} from '../../common/Color';
import LinearGradient from 'react-native-linear-gradient';
import SecondHeader from '../../components/SecondHeader';
import {AppContext} from '../../context _api/Context';
import {getmypatients} from '../../api/authService';
import DropDowns from '../../components/DropDowns';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Patients = ({navigation}) => {
  const [mypatients, setMypatinets] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const {userdata, updateSelectedPatient} = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const token = userdata?.data?.token;

  useEffect(() => {
    const fetchingData = async () => {
     
     
      const credentials = {token, "doctorId":"ALL", doctorIds: userdata?.data?.doctorIds};
      console.log("credentials",credentials);
      
      const response = await getmypatients(credentials);
      console.log("response",response);
      
    

      setMypatinets(response.docs);
      setFilteredData(response.docs);
    };
    fetchingData();
  }, [token]);

  
  const handleLetterSelect = letter => {
   
    if (letter === selectedLetter) {
      setSelectedLetter(null);
      setFilteredData(mypatients); 
    } else {
      setSelectedLetter(letter);
      const filtered = mypatients.filter(item =>
        item.patient_fname.toUpperCase().startsWith(letter),
      );

      if (filtered.length === 0) {
        Alert.alert('No matching data found');
        setFilteredData(mypatients); 
      } else {
        setFilteredData(filtered); 
      }
    }
  };

  const DateContainer = ({title, dateText}) => {
    return (
      <View style={styles.dateContainer}>
        <Text style={{color: grayColor, fontSize: 12}}>{title}</Text>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    );
  };

  const renderPatient = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        updateSelectedPatient({
          _id: item._id,
          patient_id: item.patientId,
        });
        navigation.navigate('My Patients', { screen: 'Details' });

      }}>
      <View style={styles.patientCard}>
        <Image
          source={{
            uri: `https://beta.hru.today/show-uploaded.image?path=${item?.imgPath}` || 'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
          }}
          style={styles.patientImage}
        />
        <View style={styles.patientDetailsContainer}>
          <Text style={styles.patientName}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.patientPhone}>
            Phone: {item.mobileNumber}
          </Text>
        </View>
        <View>
          {item.patient_account_type !== 'PRIMARY_PROFILE' && (
            <Image
              source={require('../../assets/family.png')} 
              style={{width: 30, height: 30}}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const onSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = mypatients.filter(item =>
        item.patient_fname.toLowerCase().includes(text.toLowerCase()) ||
        item.patient_lname.toLowerCase().includes(text.toLowerCase()) ||
        item.patient_phone_no.includes(text) 
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(mypatients); 
    }
  };
   if (!mypatients) {
      return (
         <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={greenColor} />
                    </View>
          
        
      );
    }

  return (
    <>
    <SecondHeader
        title="My Patients"
        topBarStyle={{ justifyContent: 'flex-start' ,gap:25}}
        titlecss={{ marginRight: 60 }}
        showSearch={true}
        onSearch={onSearch}
        showLocationDropdown = {false}
      />
       <DropDowns/>
      
      <LinearGradient
        colors={['white', '#d0ece7']}
        style={styles.gradient}
        // start={{ x: 0, y: 0}}
        end={{x: 3, y: 1}}>
        <View style={{marginTop:-1,backgroundColor:greenColor,alignItems:"center",}}>
        {/* <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={searchQuery}
          onChangeText={onSearch}
        /> */}
        </View>
        <DateContainer
          title="My Patients"
          dateText={`${mypatients ? mypatients.length : 0} results`}
        />

        <View style={styles.container}>
          <FlatList
            data={filteredData.length > 0 ? filteredData : mypatients}
            renderItem={renderPatient}
            keyExtractor={item => item._id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
            contentContainerStyle={styles.listContent}
          />
          <KeyboardAvoidingView    
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.alphabetContainer}>
            <TouchableOpacity
            style={{marginBottom:10}}
              onPress={() => {
                setFilteredData(mypatients);
                setSelectedLetter(null);
              }}>
              <Text style={styles.alphabetLetter}>View All</Text>
            </TouchableOpacity>
            {alphabet.map(letter => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterSelect(letter)}>
                <Text
                  style={[
                    styles.alphabetLetter,
                    letter === selectedLetter && styles.selectedLetter,
                  ]}>
                  {letter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </KeyboardAvoidingView>

          <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPatient')}>
          <Icon name="plus" size={18} color={whiteColor} />
          <Text style={styles.addButtonText}>Add Patient</Text>
        </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

export default Patients;

const styles = StyleSheet.create({
  gradient: {
    flex: 1, // Ensures the gradient covers the entire screen
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: '#f5f5f5',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  searchBox: {
   
   width:"90%",
   margin:5,
    height: 50,
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: blackColor,
    backgroundColor: whiteColor,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'transparent',
    borderRadius: 10,
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    padding: 10,
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  patientDetailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: grayColor,
  },
  patientPhone: {
    fontSize: 14,
    color: greenColor,
  },
  rowSeparator: {
    height: 10,
  },
  alphabetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  alphabetLetter: {
    fontSize: 11,
    padding: 4,
    color: greenColor,
  },
  selectedLetter: {
    color: blackColor,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
    marginHorizontal: 10,

    marginTop: 10,
    // elevation: 2,
    // shadowColor: 'white',
    // shadowOffset: {width: 0, height: verticalScale(2)},
    // shadowOpacity: 0.1,
    // shadowRadius: moderateScale(5),
  },
  dateText: {
    fontSize: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 40,
    right: 35,
    backgroundColor: greenColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonIcon: {
    color: whiteColor,
    fontSize: 14,

    marginLeft: 5,
  },
  addButtonText: {
    color: whiteColor,
    fontSize: 14,

    marginLeft: 5,
  },
});
