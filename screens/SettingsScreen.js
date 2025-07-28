import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar, ActivityIndicator, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';

const DEFAULT_SOS_MESSAGE = "I'm in some kind of Danger !!! Please help me. My Location is ";

const SettingsItem = ({ iconName, title, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Feather name={iconName} size={22} color="#8E44AD" />
        <Text style={styles.itemText}>{title}</Text>
        <Feather name="chevron-right" size={22} color="#ccc" />
    </TouchableOpacity>
);

const SettingsScreen = ({ goBack, userId, setPage }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        const fetchMessage = async () => {
            const settingsDocRef = doc(db, `artifacts/${appId}/users/${userId}/settings`, 'sos');
            try {
                const docSnap = await getDoc(settingsDocRef);
                if (docSnap.exists() && docSnap.data().message) {
                    setMessage(docSnap.data().message);
                } else {
                    setMessage(DEFAULT_SOS_MESSAGE);
                }
            } catch (error) {
                console.error("Error fetching SOS message:", error);
                setMessage(DEFAULT_SOS_MESSAGE);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessage();
    }, [userId]);

    const handleSave = async () => {
        if (!message.trim() || !userId) return;
        setIsSaving(true);
        const settingsDocRef = doc(db, `artifacts/${appId}/users/${userId}/settings`, 'sos');
        try {
            await setDoc(settingsDocRef, { message: message.trim() });
            goBack();
        } catch (error) {
            console.error("Error saving SOS message:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>Account</Text>
                <SettingsItem iconName="user" title="My Profile" onPress={() => setPage('Profile')} />
                <SettingsItem iconName="bell" title="Notifications" onPress={() => console.log("Open Notifications")} />

                <Text style={styles.sectionTitle}>General</Text>
                <SettingsItem iconName="users" title="Manage Emergency Contacts" onPress={() => setPage('Contacts')} />
                <SettingsItem iconName="settings" title="Check App Permissions" onPress={() => Linking.openSettings()} />
                
                <Text style={styles.sectionTitle}>Legal</Text>
                <SettingsItem iconName="shield" title="Privacy Policy" onPress={() => setPage('PrivacyPolicy')} />
                <SettingsItem iconName="info" title="About Us" onPress={() => setPage('AboutUs')} />

                <Text style={styles.sectionTitle}>SOS Message</Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#8E44AD" />
                ) : (
                    <View style={styles.messageBox}>
                        <Text style={styles.subLabel}>Your location link will be added automatically at the end.</Text>
                        <TextInput
                            style={styles.input}
                            value={message}
                            onChangeText={setMessage}
                            multiline
                        />
                        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isSaving}>
                            <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save Message'}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
export default SettingsScreen;
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    container: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', textTransform: 'uppercase', marginTop: 20, marginBottom: 10, },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, },
    itemText: { flex: 1, fontSize: 16, marginLeft: 15, },
    messageBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, },
    subLabel: { fontSize: 14, color: '#666', marginBottom: 15 },
    input: { backgroundColor: '#F4F4F9', padding: 15, borderRadius: 10, fontSize: 16, color: '#333', minHeight: 120, textAlignVertical: 'top', marginBottom: 20, },
    button: { backgroundColor: '#8E44AD', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});