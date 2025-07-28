import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform, StatusBar, ScrollView, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AboutUsScreen = ({ goBack }) => {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Our Mission</Text>
                <Text style={styles.paragraph}>SheGuard+ is dedicated to creating a safer world for women everywhere. We believe that technology can be a powerful ally in ensuring personal security and peace of mind. Our app is designed to be a reliable companion, providing immediate help in emergencies and a supportive community for everyday concerns.</Text>
                <Text style={styles.sectionTitle}>Developer</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/prasadankit79')}>
                    <Text style={styles.link}>github.com/prasadankit79</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};
export default AboutUsScreen;
const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: '#F4F4F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 16, backgroundColor: '#6A1B9A', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
    paragraph: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 10 },
    link: { fontSize: 16, color: '#0645AD', textDecorationLine: 'underline' }
});