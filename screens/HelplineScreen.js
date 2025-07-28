import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HelplineScreen = ({ goBack }) => {
    const [isRecording, setIsRecording] = React.useState(false);

    const handleCall = async () => {
        const phoneNumber1 = '+918658136967';
        const phoneNumber2 = '+919114244679';
        
        try {
            
            await Linking.openURL(`tel:${phoneNumber1}`);
        } catch (error) {
            
            try {
                await Linking.openURL(`tel:${phoneNumber2}`);
            } catch (err) {
                Alert.alert("Error", "Could not make the phone call.");
            }
        }
    };

    const handleRecord = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            console.log("Recording started...");
        } else {
            console.log("Recording stopped.");
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support Helpline</Text>
                <View style={{width: 24}} />
            </View>
            <View style={styles.helplineContent}>
                <Text style={styles.sectionTitle}>Immediate Call Support</Text>
                <Text style={styles.sectionDescription}>Connect with a trained professional right now. Your conversation is private and secure.</Text>
                <TouchableOpacity style={styles.button} onPress={handleCall}>
                    <Feather name="phone-call" size={20} color="#fff" style={{marginRight: 10}} />
                    <Text style={styles.buttonText}>Call 24x7 Helpline</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Send a Private Voice Note</Text>
                <Text style={styles.sectionDescription}>If you can't talk, record a message. Our team will listen and get back to you discreetly.</Text>
                <TouchableOpacity style={[styles.button, isRecording && styles.recordingButton]} onPress={handleRecord}>
                    <Feather name="mic" size={20} color="#fff" style={{marginRight: 10}} />
                    <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
                </TouchableOpacity>
                 {isRecording && <Text style={styles.recordingIndicator}>Recording in progress...</Text>}
            </View>
        </View>
    );
};

export default HelplineScreen;

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16,
        backgroundColor: '#6A1B9A', 
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20 
    },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    helplineContent: { padding: 20, flex: 1, justifyContent: 'center' },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 10 },
    sectionDescription: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
    button: { backgroundColor: '#C62828', padding: 15, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    recordingButton: { backgroundColor: '#8E44AD' },
    recordingIndicator: { textAlign: 'center', marginTop: 10, color: '#E91E63', fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: '#ddd', marginVertical: 30 },
});