import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, BackHandler, Alert, ActivityIndicator, Modal, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, onSnapshot, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';
import NetInfo from '@react-native-community/netinfo';

import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import * as Haptics from 'expo-haptics';

import { useAuth } from '../hooks/useAuth';
import SideMenu from '../components/SideMenu';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import EmergencyContactScreen from '../screens/EmergencyContactScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import HelplineScreen from '../screens/HelplineScreen';
import GeminiHelpScreen from '../screens/GeminiHelpScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import LiveShareScreen from '../screens/LiveShareScreen';
import LiveCamScreen from '../screens/LiveCamScreen';
import VoiceReportScreen from '../screens/VoiceReportScreen';
import InstructionsScreen from '../screens/InstructionsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AboutUsScreen from '../screens/AboutUsScreen';

const DEFAULT_SOS_MESSAGE = "I'm in some kind of Danger !!! Please help me. My Location is ";

const Layout = () => {
  const [page, setPage] = useState('Home');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { user, isAuthReady, logout } = useAuth();
  
  const [locationStatus, setLocationStatus] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(false);
  const [contactsStatus, setContactsStatus] = useState(false);
  
  
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
        try {
            const value = await AsyncStorage.getItem('hasOnboarded');
            if (value !== null) {
                setHasOnboarded(true);
            }
        } catch (e) {
            console.error("Failed to fetch onboarding status:", e);
        } finally {
            setIsCheckingOnboarding(false);
        }
    };
    checkOnboardingStatus();
  }, []);
  
  const handleOnboardingComplete = async () => {
      try {
          await AsyncStorage.setItem('hasOnboarded', 'true');
          setHasOnboarded(true);
      } catch (e) {
          console.error("Failed to save onboarding status:", e);
      }
  };

  const navigateTo = (newPage: string) => {
      setIsMenuVisible(false);
      setPage(newPage);
  };
  const goBack = () => setPage('Home');
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  
  useEffect(() => {
    const backAction = () => {
      if (!hasOnboarded) { 
          return true;
      }
      if (isMenuVisible) { setIsMenuVisible(false); return true; }
      if (page !== 'Home') { goBack(); return true; }
      Alert.alert("Hold on!", "Are you sure you want to exit SheGuard+?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [page, isMenuVisible, hasOnboarded]);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
        setNetworkStatus(state.isConnected && state.isInternetReachable);
    });
    const checkLocationStatus = async () => {
        let permissions = await Location.getForegroundPermissionsAsync();
        let serviceEnabled = await Location.hasServicesEnabledAsync();
        setLocationStatus(permissions.granted && serviceEnabled);
    };
    const locationInterval = setInterval(checkLocationStatus, 3000);
    let unsubscribeContacts = () => {};
    if (user) {
      const contactsDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/emergency_contacts`, 'contacts');
      unsubscribeContacts = onSnapshot(contactsDocRef, (docSnap) => {
          setContactsStatus(docSnap.exists() && docSnap.data().list && docSnap.data().list.length > 0);
      });
    } else {
      setContactsStatus(false);
    }
    return () => {
      unsubscribeNetInfo();
      unsubscribeContacts();
      clearInterval(locationInterval);
    };
  }, [user]);

  const handleLogout = async () => {
      await logout();
      setIsMenuVisible(false);
      setPage('Home');
  };

  const triggerSOS = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (!user || user.isAnonymous) {
        Alert.alert("Login Required", "Please log in to use the SOS feature.");
        setPage('Onboarding');
        return;
    }
  };

  if (isCheckingOnboarding || !isAuthReady) {
      return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#6A1B9A" /></View>;
  }

  if (!hasOnboarded) {
      return <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />;
  }
  
  const renderPage = () => {
    switch (page) {
      case 'History': return <HistoryScreen goBack={goBack} userId={user?.uid} />;
      case 'Contacts': return <EmergencyContactScreen goBack={goBack} userId={user?.uid} />;
      case 'Report': return <ReportIncidentScreen goBack={goBack} userId={user?.uid} />;
      case 'Helpline': return <HelplineScreen goBack={goBack} />;
      case 'GeminiHelp': return <GeminiHelpScreen goBack={goBack} />;
      case 'Resources': return <ResourcesScreen goBack={goBack} />;
      case 'Settings': return <SettingsScreen goBack={goBack} userId={user?.uid} setPage={navigateTo} />;
      case 'LiveShare': return <LiveShareScreen goBack={goBack} />;
      case 'LiveCam': return <LiveCamScreen goBack={goBack} />;
      case 'VoiceReport': return <VoiceReportScreen goBack={goBack} />;
      case 'Instructions': return <InstructionsScreen goBack={goBack} />;
      case 'Profile': return <ProfileScreen goBack={goBack} user={user} onLogout={handleLogout} />;
      case 'PrivacyPolicy': return <PrivacyPolicyScreen goBack={goBack} />;
      case 'AboutUs': return <AboutUsScreen goBack={goBack} />;
      case 'Home':
      default:
        return <HomeScreen 
            setPage={navigateTo} 
            triggerSOS={triggerSOS}
            toggleMenu={toggleMenu}
            locationStatus={locationStatus}
            networkStatus={networkStatus}
            contactsStatus={contactsStatus}
            requestLocationPermission={() => {}}
        />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderPage()}
      <Modal
        animationType="none"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}>
        <SideMenu user={user} onNavigate={navigateTo} onLogout={handleLogout} onClose={toggleMenu} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F4F9' },
});
export default Layout;