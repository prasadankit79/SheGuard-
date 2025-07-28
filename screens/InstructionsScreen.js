import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const InstructionSection = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionText}>{children}</Text>
    </View>
);

const InstructionsScreen = ({ goBack }) => {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>How to Use SheGuard+</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <InstructionSection title="The SOS Button">
                    This is your primary safety tool for emergencies. When you press the big red SOS button, the app will immediately get your current GPS location and prepare an emergency SMS. This message, including a Google Maps link to your location, will be sent to your saved Emergency Contacts. For this to work, please ensure you have granted the app Location permissions and have added contacts. You can even customize the default message in the Settings screen.
                </InstructionSection>

                <InstructionSection title="Emergency Contacts">
                    These are your trusted friends and family who will be alerted when you trigger an SOS. You can add up to four contacts by tapping the "Add/View Contacts" button on the home screen or through the side menu. Adding contacts is a critical step to ensure the SOS feature is fully functional. You can add or delete contacts from this screen at any time.
                </InstructionSection>

                <InstructionSection title="Live Location & Camera Sharing">
                    These features are designed for situations where you need to provide real-time updates to our safety team. When activated, they will allow our trained professionals to see your location or camera feed to better assess the situation and provide assistance. Please note, these are advanced features that will be activated in a future update.
                </InstructionSection>

                <InstructionSection title="Reporting Incidents">
                    The "Body Shaming/Harassment" button allows you to report non-emergency incidents securely. You can describe what happened, choose a category, and even submit the report anonymously. These reports are vital for our team to understand harassment patterns and offer you the right support and guidance.
                </InstructionSection>

                <InstructionSection title="SheGuard+ Help (24x7 Chat)">
                    This is your AI-powered assistant for quick, non-emergency questions. If you need information on legal rights, safety tips, or general advice, you can ask here and get an instant response. It's a great resource for immediate information and guidance.
                </InstructionSection>

                <InstructionSection title="The Side Menu (Triple Bar)">
                    Tap the menu icon in the top-left corner to access more features. Here you can view your SOS History, manage your Profile, and access other key parts of the app. We highly recommend creating an account by logging in. This ensures all your data, like contacts and SOS history, is saved securely and can be recovered if you change phones.
                </InstructionSection>
            </ScrollView>
        </View>
    );
};

export default InstructionsScreen;

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
    container: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6A1B9A',
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    }
});