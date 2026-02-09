import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import DynamicHeader from '../components/DynamicHeader';
import { getWelcomeData } from '../api/getWelcomeData';
import { getMac, type GetMacResponse } from '@/api/getMac';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  date: string;
  time: string;
  title: string;
  content: string;
}

const messages: Message[] = [
  {
    id: '1',
    date: '10 March 2022',
    time: '10:45 pm',
    title: 'Welcome to Burjeel Hospital.',
    content: 'Your health and safety are our top priority, and our caregivers are here to ensure that you have access to the top-quality care you deserve.\n\nIf you require any assistance at any time, please don\'t hesitate to contact one of our caregivers.\n\nWe wish you a speedy recovery.',
  },
  {
    id: '2',
    date: '11 March 2022',
    time: '09:45 pm',
    title: 'Appointment & Medication Reminder',
    content: 'Good Morning!\n\nYour doctor has scheduled a check-up at 2:00 PM today. Please be ready 15 minutes before the scheduled time.\n\nYour current medication schedule:\n• Morning: 8:00 AM - Blue pill\n• Afternoon: 2:00 PM - White pill\n• Evening: 8:00 PM - Yellow pill\n\nPlease remember to inform the nurse if you experience any discomfort.\n\nThank you for your cooperation.',
  },
  {
    id: '3',
    date: '14 March 2022',
    time: '12:45 pm',
    title: 'Discharge Information',
    content: 'Congratulations! Your doctor has approved your discharge for tomorrow at 10:00 AM.\n\nPlease ensure:\n• All personal belongings are packed\n• Discharge medicines are collected from pharmacy\n• Follow-up appointment is scheduled\n• Payment clearance is completed\n\nYour family member can collect the discharge summary from the nurse station.\n\nWe wish you continued good health!',
  },
];

export default function MessagesScreen() {
  const [currentTime] = useState(new Date());
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(1);
  const [contentScrollPosition, setContentScrollPosition] = useState(0);
  const [welcomeData, setWelcomeData] = useState<Awaited<ReturnType<typeof getWelcomeData>> | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<GetMacResponse | null>(null);

  // Fetch device MAC once for this screen
  useEffect(() => {
    let cancelled = false;
    getMac()
      .then((info) => {
        if (!cancelled) {
          setDeviceInfo(info);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch welcome data using dynamic MAC
  useEffect(() => {
    if (!deviceInfo?.mac) return;

    let cancelled = false;
    getWelcomeData(deviceInfo.mac)
      .then((data) => {
        if (!cancelled) setWelcomeData(data);
      })
      .catch(() => {
        // Keep null on error; header shows "—"
      });
    return () => { cancelled = true; };
  }, [deviceInfo?.mac]);

  const handleGoBack = () => {
    router.back();
  };

  const handlePreviousMessage = () => {
    if (selectedMessageIndex > 0) {
      setSelectedMessageIndex(selectedMessageIndex - 1);
      setContentScrollPosition(0);
    }
  };

  const handleNextMessage = () => {
    if (selectedMessageIndex < messages.length - 1) {
      setSelectedMessageIndex(selectedMessageIndex + 1);
      setContentScrollPosition(0);
    }
  };

  const handleScrollUp = () => {
    setContentScrollPosition(Math.max(contentScrollPosition - 50, 0));
  };

  const handleScrollDown = () => {
    setContentScrollPosition(contentScrollPosition + 50);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzY1Sf3GyQaP0mvmtxEKt4WM1JcmQid35iHy0TrWAhm7aTQy6ylNqQou2_W1GBHTPRWWh-EVwQAkK4ZvgJ9elmqjaZWqch6h_Llf9rXFCo2KI-tkiSHdgLNTkjQhnJBDJWL2DtauA=s1360-w1360-h1020-rw' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <DynamicHeader currentTime={currentTime} roomNumber={welcomeData?.room_number} />

        {/* Message Timeline */}
        <View style={styles.tabSection}>
          <View style={styles.tabRowContainer}>
            {/* Left Navigation Arrow */}
            <TouchableOpacity 
              style={styles.leftArrow}
              onPress={handlePreviousMessage}
              disabled={selectedMessageIndex === 0}
            >
              <Text style={[styles.arrowText, selectedMessageIndex === 0 && styles.arrowDisabled]}>‹</Text>
            </TouchableOpacity>

            {/* Tab Navigation */}
            <View style={styles.tabContainer}>
              {messages.map((message, index) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  key={message.id}
                  style={[
                    styles.tab,
                    selectedMessageIndex === index ? styles.activeTab : styles.inactiveTab
                  ]}
                  onPress={() => setSelectedMessageIndex(index)}
                >
                  <Text style={selectedMessageIndex === index ? styles.activeTabText : styles.inactiveTabText}>
                    {message.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Right Navigation Arrow */}
            <TouchableOpacity 
              style={styles.rightArrow}
              onPress={handleNextMessage}
              disabled={selectedMessageIndex === messages.length - 1}
            >
              <Text style={[styles.arrowText, selectedMessageIndex === messages.length - 1 && styles.arrowDisabled]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.messageCard}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.messageTitle}>{messages[selectedMessageIndex].title}</Text>
              <Text style={styles.messageText}>{messages[selectedMessageIndex].content}</Text>
            </ScrollView>

            {/* Scroll Indicators */}
            <TouchableOpacity 
              activeOpacity={0.6}
              style={[styles.scrollIndicator, styles.scrollUp]}
              onPress={handleScrollUp}
            >
              <Text style={styles.scrollIcon}>▲</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.6}
              style={[styles.scrollIndicator, styles.scrollDown]}
              onPress={handleScrollDown}
            >
              <Text style={styles.scrollIcon}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.controlItem} onPress={handleGoBack}>
            <View style={styles.sphericalButton}>
              <Text style={styles.menuButtonText}>MENU</Text>
            </View>
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.sphericalButton}>
              <View style={styles.dpadContainer}>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.scrollDpadArrow}>▲</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
                <View style={styles.dpadRow}>
                  <Text style={styles.dpadArrow}>◄</Text>
                  <View style={styles.dpadCenter}>
                    <Text style={styles.dpadOK}>OK</Text>
                  </View>
                  <Text style={styles.dpadArrow}>►</Text>
                </View>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.scrollDpadArrow}>▼</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
              </View>
            </View>
            <Text style={styles.controlLabel}>SELECT CATEGORY</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.sphericalButton}>
              <View style={styles.dpadContainer}>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▲</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
                <View style={styles.dpadRow}>
                  <Text style={styles.scrollDpadArrow}>◄</Text>
                  <View style={styles.dpadCenter}>
                    <Text style={styles.dpadOK}>OK</Text>
                  </View>
                  <Text style={styles.scrollDpadArrow}>►</Text>
                </View>
                <View style={styles.dpadRow}>
                  <View style={styles.dpadArrowPlaceholder} />
                  <Text style={styles.dpadArrow}>▼</Text>
                  <View style={styles.dpadArrowPlaceholder} />
                </View>
              </View>
            </View>
            <Text style={styles.controlLabel}>SCROLL CONTENT</Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerInfo: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  tabSection: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  tabRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    width: '100%',
  },
  leftArrow: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  rightArrow: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  arrowText: {
    fontSize: 40,
    color: '#000000',
    fontWeight: 'bold',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  tabContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#8B1538',
  },
  inactiveTab: {
    backgroundColor: '#FFFFFF',
  },
  activeTabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 15,
  },
  messageCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 28,
  },
  scrollIndicator: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 21, 56, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollUp: {
    top: 20,
  },
  scrollDown: {
    bottom: 20,
  },
  scrollIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  sphericalButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  menuButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  dpadContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 12,
  },
  dpadArrow: {
    fontSize: 9,
    color: '#000000',
    fontWeight: 'bold',
    width: 12,
    textAlign: 'center',
    lineHeight: 12,
  },
  scrollDpadArrow: {
    fontSize: 9,
    color: '#808080',
    fontWeight: 'bold',
    width: 12,
    textAlign: 'center',
    lineHeight: 12,
    opacity: 0.5,
  },
  dpadArrowPlaceholder: {
    width: 12,
  },
  dpadCenter: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  dpadOK: {
    fontSize: 5,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 12,
  },
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 8,
  },
});

