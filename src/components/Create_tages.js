import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { greenColor } from '../common/Color';
import { AppContext } from '../context _api/Context';

const Create_tags = ({ data, Label, appointmentId, item }) => {
   

    const inputRef = useRef('');
    const dropdownRef = useRef(false);
    const selectedValuesRef = useRef([]);
    const metadata = useRef([]);
    const [loading, setLoading] = useState(true);
    const [inputContainerHeight, setInputContainerHeight] = useState(80);
    const { digital_Prescription, Digtail_PrescriptionData } = useContext(AppContext);
    const [, forceUpdate] = useState();
    useEffect(() => {
        switch (Label) {
            case 'Complaints':
                selectedValuesRef.current = item?.complaints || [];
                break;
            case 'Diagnosis':
                selectedValuesRef.current = item?.diagnosis || [];
                break;
            case 'Procedures':
                selectedValuesRef.current = item?.procedures || [];
                break;
            default:
                selectedValuesRef.current = [];
        }

    }, [item, Label]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            if (digital_Prescription[appointmentId]?.[Label]) {
                selectedValuesRef.current = digital_Prescription[appointmentId][Label];
                metadata.current = selectedValuesRef.current.map((value, index) => ({ value, index }));
            }
            setLoading(false);
            forceUpdate({});
        }, 1000);
    }, [appointmentId, Label]);



    const handleSelectValue = useCallback((value) => {
        if (selectedValuesRef.current.includes(value)) {
           
            handleUnselectValue(value);
        } else {
           
            selectedValuesRef.current = [...selectedValuesRef.current, value];
            metadata.current = [...metadata.current, { value, $order: selectedValuesRef.current.length - 1 }];
            Digtail_PrescriptionData(appointmentId, Label, selectedValuesRef.current);
            Digtail_PrescriptionData(appointmentId, Label + "_metadata", metadata.current);
        }
    
        dropdownRef.current = false; // Close the dropdown
        inputRef.current = ''; // Clear the input field
        forceUpdate({});
    }, [appointmentId, Label]);
    
    

    const handleUnselectValue = useCallback((value) => {
        selectedValuesRef.current = selectedValuesRef.current.filter((el) => el !== value);
        metadata.current = metadata.current.filter((item) => item.value !== value);
        Digtail_PrescriptionData(appointmentId, Label, selectedValuesRef.current);
        Digtail_PrescriptionData(appointmentId, Label + "_metadata", metadata.current);

        forceUpdate({});
    }, [appointmentId, Label]);
   

    const handleInputChange = (text) => {
        inputRef.current = text;
        dropdownRef.current = true;
        forceUpdate({});
    };

    const filteredData = data.filter(
        (item) => !selectedValuesRef.current.includes(item) && item.toLowerCase().includes(inputRef.current.toLowerCase())
    );
  

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={styles.loader_container}>
                    <ActivityIndicator size="large" color={greenColor} />
                </View>
            ) : (
                <>
                    <View style={styles.input_container}
                     onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setInputContainerHeight(height);
                    }}
                    >

                        <Text style={styles.label_text}>{Label}</Text>
                        <View style={styles.input_box_with_tags}>
                            {selectedValuesRef.current.map((value, index) => (
                                <View key={index} style={styles.inline_tag}>
                                    <Text style={styles.inline_tag_text}>{value}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleUnselectValue(value)}
                                        style={styles.unselect_button}
                                    >
                                        <Text style={styles.unselect_button_text}>×</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TextInput
                                style={styles.input_box}
                                value={inputRef.current}
                                onChangeText={handleInputChange}
                                onFocus={() => {
                                    dropdownRef.current = true;
                                    forceUpdate({});
                                }}
                            />
                        </View>

                        {dropdownRef.current && (
                            <View style={[styles.dropdown,{top: inputContainerHeight }]}>
                                <ScrollView>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((el, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.dropdown_item}
                                                onPress={() => handleSelectValue(el)}
                                            >
                                                <Text style={styles.dropdown_text}>{el}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => handleSelectValue(inputRef.current)}
                                            style={styles.dropdown_item}
                                        >
                                            <Text style={styles.dropdown_text}>
                                                Add "{inputRef.current}"
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View style={styles.button_container}>
                        <View style={styles.buttons_display}>
                            {data.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.data_button, selectedValuesRef.current.includes(item) && styles.selected_button]}
                                    onPress={() => handleSelectValue(item)}
                                >
                                    <Text
                                        style={[
                                            styles.data_button_text,
                                            selectedValuesRef.current.includes(item) && styles.selected_button_text,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default Create_tags;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    loader_container: { // ⬅️ Added for Loader
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200, // Adjust height as needed
    },
    label_text: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input_container: {
        position: 'relative',
        marginBottom: 16,
    },
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
    },
    inline_tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 4,
    },
    inline_tag_text: {
        fontSize: 14,
        color: '#00796b',
    },
    unselect_button: {
        marginLeft: 6,
        backgroundColor: '#ff6b6b',
        borderRadius: 12,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unselect_button_text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    input_box: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        paddingHorizontal: 5,
        minHeight: 40,
    },
    dropdown: {
        position: 'absolute',
        top: 80,
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
    dropdown_text: {
        fontSize: 14,
        color: '#333',
    },
    button_container: {
        marginTop: 16,
        marginBottom: 16,
    },
    data_button: {
        margin: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f2f3f4",
        borderRadius: 5,
    },
    selected_button: {
        backgroundColor: greenColor,
    },
    data_button_text: {
        fontSize: 12,
        color: '#333',
    },
    selected_button_text: {
        color: '#fff',
    },
    buttons_display: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
});
