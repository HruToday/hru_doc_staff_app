import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Create_tages from '../../components/Create_tages'
import { AppContext } from '../../context _api/Context';
import { fetchDiagnosisTags, fetchProceduresTags } from '../../api/authService';
import CustomButton from '../../common/CustomButton';
import { greenColor } from '../../common/Color';
import { useNavigation } from '@react-navigation/native';

const Procedures = ({route}) => {
    const appointmentId = route?.params?.appointmentId;

    const navigation = useNavigation();
    const Label="Procedures"
    const { item,userdata } = useContext(AppContext);
    const token = userdata?.data?.auth_token;
    const [data, setData] = useState([])

    useEffect(() => {
        const handleFetch = async () => {
            const credentials = {
                token: token
            }
            const response = await fetchProceduresTags(credentials)
            setData(response.recent_procedures)


        }
        handleFetch()
    }, [])
    return (
        <View style={styles.container}>
              <Create_tages data={data} Label={Label} appointmentId={appointmentId} item={item} />
            <View style={styles.buttonsContainer}>
                <CustomButton
                    style={styles.leftButton}
                   onPress={() => navigation.navigate('Diagnosis',{appointmentId: appointmentId })}
                    title={'← Diagnosis'}
                />
                <CustomButton
                    style={styles.rightButton}
                    title={'Medication →'}
                    onPress={() => navigation.navigate('Medication',{appointmentId: appointmentId })}
                />
            </View>
        </View>
    )
}

export default Procedures

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