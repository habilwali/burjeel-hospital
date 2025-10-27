import React, { useState } from 'react';
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
        source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.roomText}>Room 215</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerInfo}>
              {formatDate(currentTime)} | {formatTime(currentTime)} | ☁️ 19°C
            </Text>
          </View>
        </View>

        {/* Message Timeline */}
        <View style={styles.timelineContainer}>
          <TouchableOpacity 
            activeOpacity={0.6}
            style={styles.arrowButton}
            onPress={handlePreviousMessage}
            disabled={selectedMessageIndex === 0}
          >
            <Text style={[styles.arrowText, selectedMessageIndex === 0 && styles.arrowDisabled]}>‹</Text>
          </TouchableOpacity>

          {messages.map((message, index) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={message.id}
              style={[
                styles.timelineItem,
                selectedMessageIndex === index && styles.timelineItemActive
              ]}
              onPress={() => setSelectedMessageIndex(index)}
            >
              <Text style={[
                styles.timelineDate,
                selectedMessageIndex === index && styles.timelineTextActive
              ]}>
                {message.date}
              </Text>
              <Text style={[
                styles.timelineTime,
                selectedMessageIndex === index && styles.timelineTextActive
              ]}>
                {message.time}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            activeOpacity={0.6}
            style={styles.arrowButton}
            onPress={handleNextMessage}
            disabled={selectedMessageIndex === messages.length - 1}
          >
            <Text style={[styles.arrowText, selectedMessageIndex === messages.length - 1 && styles.arrowDisabled]}>›</Text>
          </TouchableOpacity>
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
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>MENU BAR</Text>
          </TouchableOpacity>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
            <Text style={styles.controlLabel}>SELECT CATEGORY</Text>
          </View>
          <View style={styles.controlItem}>
            <View style={styles.controlButton} />
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
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    gap: 10,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  timelineItem: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    minWidth: 180,
    alignItems: 'center',
  },
  timelineItemActive: {
    backgroundColor: '#8B1538',
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timelineTextActive: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCard: {
    width: '80%',
    maxWidth: 800,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 300,
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
    gap: 10,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#90A4AE',
    borderWidth: 2,
    borderColor: '#666',
  },
  controlLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
});

