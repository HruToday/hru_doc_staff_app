import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Create_tages from '../../components/Create_tages';
import { AppContext } from '../../context _api/Context';
import { fetchDiagnosisTags } from '../../api/authService';
import CustomButton from '../../common/CustomButton';
import { greenColor } from '../../common/Color';
import { useNavigation } from '@react-navigation/native';

const Diagnosis = ({ route }) => {
    const appointmentId = route?.params?.appointmentId;
   
    const navigation = useNavigation();
    const Label = "Diagnosis";
    const { item,userdata } = useContext(AppContext);
    const token = userdata?.data?.auth_token;
    const [data, setData] = useState([]);

    useEffect(() => {
        const handleFetch = async () => {
            if (token) {
                const credentials = { token };
                const response = await fetchDiagnosisTags(credentials);
                setData(response.recent_diagnosis);
            }
        };
        handleFetch();
    }, [token]);

    return (
        <View style={styles.container}>
            <Create_tages data={data} Label={Label} appointmentId={appointmentId} item={item} />
            <View style={styles.buttonsContainer}>
                <CustomButton
                    style={styles.leftButton}
                    onPress={() => navigation.navigate('Complaints', { appointmentId: appointmentId })}
                    title={'← Complaints'}
                />
                <CustomButton
                    style={styles.rightButton}
                    title={'Procedures →'}
                    onPress={() => navigation.navigate('Procedures', { appointmentId: appointmentId })}
                />
            </View>
        </View>
    );
};

export default Diagnosis;

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
});
