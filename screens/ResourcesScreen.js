import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const Icon = ({ library, name, size, color }) => {
  const Lib = { Feather, MaterialCommunityIcons }[library];
  return <Lib name={name} size={size} color={color} />;
};

const ResourceItem = ({ iconLib, iconName, title, onPress }) => (
    <TouchableOpacity style={styles.resourceItem} onPress={onPress}>
        <Icon library={iconLib} name={iconName} size={24} color="#8E44AD" />
        <Text style={styles.resourceTitle}>{title}</Text>
        <Icon library="Feather" name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
);

const ResourcesScreen = ({ goBack }) => {
    const handlePress = (resource) => {
        console.log(`Tapped on resource: ${resource}`);
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBack}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Resources</Text>
                <View style={{width: 24}} />
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                <ResourceItem
                    iconLib="Feather"
                    iconName="help-circle"
                    title="Common Questions"
                    onPress={() => handlePress('Common Questions')}
                />
                <ResourceItem
                    iconLib="MaterialCommunityIcons"
                    iconName="water-outline"
                    title="Sanitary & Menstrual Health"
                    onPress={() => handlePress('Sanitary')}
                />
                <ResourceItem
                    iconLib="MaterialCommunityIcons"
                    iconName="hand-heart-outline"
                    title="Health and Hygiene"
                    onPress={() => handlePress('Health and Hygiene')}
                />
                <ResourceItem
                    iconLib="MaterialCommunityIcons"
                    iconName="shield-alert-outline"
                    title="Harassment & Your Rights"
                    onPress={() => handlePress('Harassment')}
                />
                <ResourceItem
                    iconLib="MaterialCommunityIcons"
                    iconName="weather-night"
                    title="How to be Safe at Night"
                    onPress={() => handlePress('Night Safety')}
                />
                <ResourceItem
                    iconLib="Feather"
                    iconName="archive"
                    title="Previously Answered Questions"
                    onPress={() => handlePress('History')}
                />
            </ScrollView>
        </View>
    );
};

export default ResourcesScreen;

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
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    resourceTitle: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        fontWeight: '500',
    },
});
