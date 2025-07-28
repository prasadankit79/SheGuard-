import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LiveShareScreen = ({ goBack }) => {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Live Location Sharing</Text>
                <View style={{width: 24}} />
            </View>
            <View style={styles.content}>
                <Text style={styles.placeholderText}>Live Location Sharing Feature</Text>
                <Text style={styles.comingSoonText}>Coming Soon!</Text>
            </View>
        </View>
    );
};

export default LiveShareScreen;

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
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    comingSoonText: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    }
});