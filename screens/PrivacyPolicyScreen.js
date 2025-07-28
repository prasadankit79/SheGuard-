import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const PrivacyPolicyScreen = ({ goBack }) => {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.paragraph}>Last updated: July 28, 2025</Text>
                <Text style={styles.paragraph}>SheGuard+ ("us", "we", or "our") operates the SheGuard+ mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.</Text>
                <Text style={styles.sectionTitle}>Information Collection and Use</Text>
                <Text style={styles.paragraph}>We collect several different types of information for various purposes to provide and improve our Service to you. This includes location data and emergency contact information, which is used solely for the purpose of sending SOS alerts at your request.</Text>
                <Text style={styles.sectionTitle}>Data Security</Text>
                <Text style={styles.paragraph}>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We use commercially acceptable means to protect your Personal Data.</Text>
            </ScrollView>
        </View>
    );
};
export default PrivacyPolicyScreen;
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
    paragraph: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 10 }
});