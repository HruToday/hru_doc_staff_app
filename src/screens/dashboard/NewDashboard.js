import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {greenColor} from '../../common/Color';
import DynamicImageSlider from '../../components/DynamicImageSlider';
import BarChartExample from '../../components/Barchart';

const HeaderWithAction = ({heading, actionText, onPress}) => {
  return (
    <View style={styles.Headercontainer}>
      {/* Left Heading */}
      <Text style={styles.heading}>{heading}</Text>

      {/* Right Touchable Text */}
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const NewDashboard = () => {
  const data = [
    {
      id: '1',
      name: 'John Doe',
      photo:
        'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
      mobile: '123-456-7890',
      details: 'Patient Details 1',
      date: '2024-12-13',
      time: '10:00 AM',
    },
    {
      id: '2',
      name: 'Jane Smith',
      photo:
        'https://beta.hru.today/doctor/:673d8b440d9b9d0acbc030a1/display.image',
      mobile: '987-654-3210',
      details: 'Patient Details 2',
      date: '2024-12-14',
      time: '11:00 AM',
    },
    // Add more data here
  ];
  const images = [
    'https://cdn.dribbble.com/userupload/10482911/file/original-63bd58c7d4b5da580468b8acf583bbdf.jpg?resize=1504x1128&vertical=center',
    'https://www.creativefabrica.com/wp-content/uploads/2021/09/14/Healthcare-and-medical-web-banner-Graphics-17249883-1-1-580x387.jpg',
    'https://www.creativefabrica.com/wp-content/uploads/2021/05/17/Healthcare-medical-web-banner-Graphics-12115584-1-1-580x387.jpg',
  ];
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.patientInfo}>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text>{item.mobile}</Text>
          <Text>{item.details}</Text>
        </View>
        <Image source={{uri: item.photo}} style={styles.patientImage} />
      </View>

      <View style={styles.appointmentInfo}>
        <View style={styles.appointmentItem}>
          <Icon name="calendar" size={20} color={greenColor} />
          <Text>{item.date}</Text>
        </View>
        <View style={styles.appointmentItem}>
          <Icon name="clock-o" size={20} color={greenColor} />
          <Text>{item.time}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View>
          <Text style={{fontSize: 20, fontWeight: '200'}}>Hello,</Text>
          <Text style={{fontSize: 30, fontWeight: '900'}}>
            Dr. Rahul Sharma!
          </Text>
        </View>
        <View style={styles.notifaction_container}>
          <Image
            source={require('../../assets/ball.png')}
            style={styles.ball_image}
          />
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/doc.png")} // Replace with your image URL
              style={styles.image}
            />
          </View>
        </View>
      </View>

      {/* Search Box */}
      <View style={styles.searchbox_container}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <View style={styles.iconContainer}>
          <Icon name="search" size={24} color="lightgray" />
        </View>
      </View>

      {/* Header with Action */}
      <HeaderWithAction
        heading="Today's Records"
        actionText="12th Dec"
        onPress={() => Alert.alert('Edit Pressed')}
      />

      <View style={styles.box_container}>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={{fontSize: 40, fontWeight: '900'}}>7</Text>
            <Text style={{fontSize: 10, fontWeight: '400'}}>Appointment</Text>
          </View>
          <View style={[styles.box, {backgroundColor: '#e8f8f5'}]}>
            <Text style={{fontSize: 40, fontWeight: '900'}}>07</Text>
            <Text style={{fontSize: 10, fontWeight: '400'}}>Completed</Text>
          </View>
          <View style={styles.boxWithImage}>
            <Text style={{fontSize: 40, fontWeight: '900'}}>04</Text>
            <Text style={{fontSize: 10, fontWeight: '400'}}>Remaining</Text>
            <Image
              source={require('../../assets/cal.png')}
              style={styles.box_container_image}
            />
          </View>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>New Registration: 10 |</Text>
          <Text style={styles.statsText}>Schedule: 05 |</Text>
          <Text style={styles.statsText}>Walk-in: 10</Text>
        </View>
      </View>
      <HeaderWithAction
        heading="UpComing Appointments"
        actionText="View All"
        onPress={() => Alert.alert('Edit Pressed')}
      />

      <View style={styles.card_container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <HeaderWithAction
        heading="Quicks Links"
        actionText=""
        onPress={() => Alert.alert('Edit Pressed')}
      />
      <View style={styles.mainContainer}>
        <View style={styles.rowLayout}>
          {/* First Box */}
          <View style={styles.boxContainer}>
            <Text style={styles.boxText}>Add Appointments</Text>
            <Image
              source={require('../../assets/called.png')}
              style={styles.topRightImage}
            />
          </View>
          {/* Second Box */}
          <View style={styles.boxContainer}>
            <Text style={styles.boxText}>Vitals & Prescription</Text>
            <Image
              source={require('../../assets/valt.png')}
              style={styles.topRightImage}
            />
          </View>
        </View>

        <View style={styles.rowLayout}>
          {/* Third Box */}
          <View style={styles.boxContainer}>
            <Text style={styles.boxText}>Mypatient & Reports</Text>
            <Image
              source={require('../../assets/group.png')}
              style={styles.topRightImage}
            />
          </View>
          {/* Fourth Box */}
          <View style={styles.boxContainer}>
            <Text style={styles.boxText}>Workqueue</Text>
            <Image
              source={require('../../assets/round.png')}
              style={styles.topRightImage}
            />
          </View>
        </View>
      </View>
      <DynamicImageSlider
        images={images}
        sliderHeight={150} // Dynamic height
        containerStyle={{marginBottom: 20}}
        //   onImagePress={handleImagePress} // Callback on image press
        autoScrollInterval={2000} // Automatic scrolling interval (2 seconds)
      />
      <View style={{marginBottom: 10}}>
        <BarChartExample />
      </View>
    </ScrollView>
  );
};

export default NewDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeded',
    padding: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  notifaction_container: {
    width:"30%",
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  icon: {
    marginRight: 15,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width/height for a circle
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  searchbox_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15, // Rounded corners for the container
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, // Shadow for Android
    margin: 10, // Adds spacing around the container
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20, // Rounded corners for the input
    padding: 10,
    fontSize: 16,
    borderWidth: 0, // No border
    color: '#000',
  },
  iconContainer: {
    alignItems: 'center',
  },
  Headercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    // Optional bottom border for separation
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  actionText: {
    fontSize: 14,
    color: greenColor, // Optional link-style color
    fontWeight: '500',
  },

  box_container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 200,
    padding: 20,
    borderRadius: 30,
    margin: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  box: {
    width: 100,
    height: 100,

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  // Box 3 with absolute positioned image
  boxWithImage: {
    width: 100,
    height: 100,
    backgroundColor: '#fcf3cf',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative', // Make this container relative for absolute positioning
  },
  ball_image: {
    width: 30,
    height: 30,
  },
  box_container_image: {
    position: 'absolute',
    top: -15,
    right: -10,
    width: 50,
    height: 50,
    transform: [{rotate: '20deg'}],

    // zIndex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1, // Bottom border
    borderTopColor: '#f4f6f6', // Light color for bottom border
    backgroundColor: '#fff', // Background color for the view
  },
  statsText: {
    fontSize: 12,
    color: '#333', // Dark text color
    fontWeight: '500',
  },
  card_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  patientImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
  },
  patientDetails: {
    justifyContent: 'center',
  },
  patientName: {
    fontWeight: 'bold',
  },
  appointmentInfo: {
    backgroundColor: '#e8f8f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mainContainer: {
    flex: 1,
    padding: 10,
  },
  rowLayout: {
    flexDirection: 'row', // Arranges boxes in a row
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10, // Adds space between rows
  },
  boxContainer: {
    width: '48%', // Box width, adjust as needed
    height: 120, // Box height, adjust as needed
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    position: 'relative', // For absolute positioning of image
    marginBottom: 10,
  },
  topRightImage: {
    position: 'absolute',
    top: -15,
    right: 0,
    width: 70,
    height: 70,
    borderRadius: 5,
    transform: [{rotate: '10deg'}],
    // To make the image circular or square as needed
  },
  boxText: {
    marginTop: 50,
    fontSize: 20,
    fontStyle: 'italic',
    // fontWeight: '800',
  },
});
