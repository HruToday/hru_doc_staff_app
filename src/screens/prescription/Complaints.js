import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Create_tages from '../../components/Create_tages'
import { AppContext } from '../../context _api/Context';
import { fetchComplaintstags, fetchProceduresTags } from '../../api/authService';
import CustomButton from '../../common/CustomButton';
import { greenColor } from '../../common/Color';
import { useNavigation } from '@react-navigation/native';

const Complaints = ({ route }) => {
    const appointmentId = route?.params?.appointmentId;

    const navigation = useNavigation();
    const Label = "Complaints"
    const { item,userdata,gendertoggle } = useContext(AppContext);
    const token = userdata?.data?.auth_token;
    const [data, setData] = useState([])

    useEffect(() => {
        const handleFetch = async () => {
            const credentials = {
                token: token
            }
            const response = await fetchComplaintstags(credentials)
            setData(response.recent_advice)


        }
        handleFetch()
    }, [])
    const handleNavigation = () => {
        if (gendertoggle === "FEMALE") {
           // Navigate to Compliance if Female
           navigation.navigate('lmp', { appointmentId: appointmentId});
        } else {
          navigation.navigate('Vitals', { appointmentId: appointmentId });
         
           // Otherwise, keep the current navigation
        }
      };
    return (
        <View style={styles.container}>
            <Create_tages data={data} Label={Label} appointmentId={appointmentId} item={item} />
            <View style={styles.buttonsContainer}>
                <CustomButton
                    style={styles.leftButton}
                    onPress={handleNavigation}
                    title={gendertoggle === "FEMALE" ? "← LMP" : "← Vitals"}
                />
                <CustomButton
                    style={styles.rightButton}
                    title={'Diagnosis →'}
                    onPress={() => navigation.navigate('Diagnosis', { appointmentId: appointmentId})}
                />
            </View>
        </View>
    )
}

export default Complaints

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
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
})