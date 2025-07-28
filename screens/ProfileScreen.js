import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SettingsItem = ({ iconName, title, onPress, color = "#333" }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Feather name={iconName} size={22} color={color} />
        <Text style={[styles.itemText, {color: color}]}>{title}</Text>
    </TouchableOpacity>
);

const ProfileScreen = ({ goBack, user, onLogout }) => {

    const handlePasswordReset = () => {
        if (user && user.email) {
            sendPasswordResetEmail(auth, user.email)
                .then(() => {
                    Alert.alert(
                        "Check Your Email", 
                        `A password reset link has been sent to ${user.email}. Please follow the instructions to set a new password.`
                    );
                })
                .catch(error => {
                    Alert.alert("Error", error.message);
                });
        } else {
            Alert.alert("Error", "Password reset is only available for users who signed up with an email.");
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you absolutely sure you want to delete your account? All your data will be permanently lost. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!user) return;
                        try {
                            await deleteUser(user);
                            await onLogout();
                        } catch (error) {
                            Alert.alert("Error", "Could not delete account. Please try logging in again recently to perform this action.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{width: 24}} />
            </View>
            <View style={styles.container}>
                <View style={styles.emailContainer}>
                    <Text style={styles.emailLabel}>Logged in as:</Text>
                    <Text style={styles.emailText}>{user?.isAnonymous ? "Anonymous User" : user?.email}</Text>
                </View>

                {user && !user.isAnonymous && (
                    <>
                        <SettingsItem iconName="lock" title="Change Password" onPress={handlePasswordReset} />
                        {/* New Informational Text Below */}
                        <Text style={styles.noteText}>Note: If you don't see the email, please check your spam or junk folder.</Text>
                        
                        <View style={{marginTop: 20}}>
                           <SettingsItem iconName="trash-2" title="Delete Account" color="#C62828" onPress={handleDeleteAccount} />
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};
export default ProfileScreen;

const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    container: { padding: 20 },
    emailContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    emailLabel: {
        fontSize: 16,
        color: '#666',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        fontWeight: '500',
    },
    noteText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: -5,
        marginBottom: 10,
    }
});