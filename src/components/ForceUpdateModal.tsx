import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';
import { getStoreUrl } from '../services/configService';

interface ForceUpdateModalProps {
  visible: boolean;
  message?: string;
  isMaintenance?: boolean;
}

function ForceUpdateModalComponent({
  visible,
  message,
  isMaintenance = false,
}: ForceUpdateModalProps) {
  const handleUpdate = useCallback(() => {
    Linking.openURL(getStoreUrl());
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={isMaintenance ? 'wrench-outline' : 'cellphone-arrow-down'}
              size={wp('10%')}
              color={Colors.accent.primary}
            />
          </View>
          <Text style={styles.title}>
            {isMaintenance ? 'Under Maintenance' : 'Update Required'}
          </Text>
          <Text style={styles.message}>
            {message ||
              (isMaintenance
                ? 'We are performing scheduled maintenance. Please check back shortly.'
                : 'A new version is available. Please update the app to continue playing.')}
          </Text>
          {!isMaintenance && (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleUpdate}
            >
              <MaterialCommunityIcons
                name="google-play"
                size={wp('4.5%')}
                color="#ffffff"
              />
              <Text style={styles.buttonText}>Update Now</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

export const ForceUpdateModal = memo(ForceUpdateModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('8%'),
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('8%'),
    alignItems: 'center',
    width: '100%',
    maxWidth: wp('85%'),
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.2)',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    backgroundColor: 'rgba(124, 92, 252, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('5.5%'),
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: hp('1%'),
  },
  message: {
    fontSize: wp('3.6%'),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: wp('5.5%'),
    marginBottom: hp('3%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: wp('10%'),
    paddingVertical: hp('1.8%'),
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonPressed: {
    backgroundColor: Colors.accent.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: wp('4.2%'),
    fontWeight: '700',
  },
});
