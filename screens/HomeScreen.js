import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, StatusBar } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Icon = ({ library, name, size, color }) => {
  const Lib = { Feather, MaterialCommunityIcons, Ionicons }[library];
  if (!Lib) return null;
  return <Lib name={name} size={size} color={color} />;
};

const StatusItem = ({ iconLibOn, iconNameOn, iconLibOff, iconNameOff, text, isEnabled, onPress }) => (
    <TouchableOpacity style={styles.statusItem} onPress={onPress} disabled={!onPress}>
        <Icon 
            library={isEnabled ? iconLibOn : iconLibOff} 
            name={isEnabled ? iconNameOn : iconNameOff} 
            size={24} 
            color={isEnabled ? "#4CAF50" : "#aaa"} 
        />
        <Text style={[styles.statusText, { color: isEnabled ? "#4CAF50" : "#666" }]}>{text}</Text>
    </TouchableOpacity>
);

const HomeScreen = ({ setPage, toggleMenu, triggerSOS, locationStatus, networkStatus, contactsStatus, requestLocationPermission }) => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon library="Feather" name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SheGuard+</Text>
        <TouchableOpacity onPress={() => setPage('Settings')}>
          <Icon library="Feather" name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.homeContent}>
        
        <Text style={styles.greeting}>Welcome, stay safe.</Text>
        <Text style={styles.subGreeting}>Press the button below in case of emergency.</Text>
        
        <View style={styles.sosWrapper}>
            <TouchableOpacity style={styles.sosButton} onPress={triggerSOS} activeOpacity={0.8}>
              <View style={styles.sosRipple1} />
              <View style={styles.sosRipple2} />
              <Text style={styles.sosButtonText}>SOS</Text>
              <Text style={styles.sosButtonSubText}>"Bachao!"</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.statusGrid}>
            <StatusItem 
                iconLibOn="MaterialCommunityIcons"
                iconNameOn="map-marker"
                iconLibOff="MaterialCommunityIcons"
                iconNameOff="map-marker-off"
                text={locationStatus ? "Location ON" : "Location OFF"} 
                isEnabled={locationStatus}
                onPress={!locationStatus ? requestLocationPermission : null}
            />
            <StatusItem 
                iconLibOn="Feather"
                iconNameOn="wifi"
                iconLibOff="Feather"
                iconNameOff="wifi-off"
                text={networkStatus ? "Online" : "Offline"} 
                isEnabled={networkStatus}
            />
            <StatusItem 
                iconLibOn="Feather"
                iconNameOn="users"
                iconLibOff="Feather"
                iconNameOff="users"
                text={contactsStatus ? "View Contacts" : "Add Contacts"} 
                isEnabled={contactsStatus}
                onPress={() => setPage('Contacts')}
            />
        </View>

        <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('LiveShare')}>
                <Icon library="MaterialCommunityIcons" name="map-marker-path" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>Live Location Sharing</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('LiveCam')}>
                <Icon library="MaterialCommunityIcons" name="camera-iris" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>Live Location & Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('VoiceReport')}>
                <Icon library="Feather" name="mic" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>Voice Message Incident</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('Report')}>
                <Icon library="MaterialCommunityIcons" name="comment-alert-outline" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>Body Shaming/Harassment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('Resources')}>
                <Icon library="Feather" name="help-circle" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>Common Problems</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setPage('GeminiHelp')}>
                <Icon library="Ionicons" name="chatbubbles-outline" size={32} color="#8E44AD" />
                <Text style={styles.quickActionText}>24x7 Instant Chat</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.callButton} onPress={() => setPage('Helpline')}>
            <Icon library="Feather" name="phone-call" size={24} color="#fff" />
            <Text style={styles.callButtonText}>Call Us</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const { width } = Dimensions.get('window');
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
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },
  homeContent: { 
      padding: 20,
  },
  greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
  },
  subGreeting: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 20,
  },
  sosWrapper: {
      alignItems: 'center',
      marginVertical: 10, 
  },
  sosButton: { 
    width: width * 0.5, 
    height: width * 0.5, 
    borderRadius: width * 0.25, 
    backgroundColor: '#E91E63', 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 5, 
    elevation: 8, 
  },
  sosRipple1: { position: 'absolute', width: '100%', height: '100%', borderRadius: width * 0.25, backgroundColor: 'rgba(233, 30, 99, 0.3)', transform: [{ scale: 1.2 }] },
  sosRipple2: { position: 'absolute', width: '100%', height: '100%', borderRadius: width * 0.25, backgroundColor: 'rgba(233, 30, 99, 0.2)', transform: [{ scale: 1.4 }] },
  sosButtonText: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  sosButtonSubText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  statusGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    paddingVertical: 15, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    shadowOffset: {width: 0, height: 2}, 
    marginTop: 20,
    marginBottom: 30,
  },
  statusItem: { alignItems: 'center', flex: 1 },
  statusText: { marginTop: 6, fontSize: 12, fontWeight: '600' },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
  quickAction: { width: '48%', backgroundColor: '#fff', padding: 15, borderRadius: 15, alignItems: 'center', marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5, minHeight: 120, justifyContent: 'center' },
  quickActionText: { marginTop: 10, fontSize: 14, color: '#333', fontWeight: '600', textAlign: 'center' },
  callButton: {
      flexDirection: 'row',
      backgroundColor: '#C62828',
      paddingVertical: 15,
      paddingHorizontal: 40, 
      borderRadius: 30,
      alignItems: 'center',
      marginTop: 20,
      elevation: 5,
      alignSelf: 'center',
  },
  callButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
  }
});