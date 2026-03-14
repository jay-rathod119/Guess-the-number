import React, { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Linking,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { wp, hp } from '../constants/layout';
import { useGameStore } from '../store/gameStore';
import { DIFFICULTY_CONFIGS, type Difficulty } from '../utils/gameUtils';

type ModalType = 'how_to_play' | 'about' | 'rate_us' | 'feedback' | 'difficulty' | null;

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'new_game', label: 'New Game', icon: 'restart' },
  { id: 'difficulty', label: 'Difficulty', icon: 'speedometer' },
  { id: 'how_to_play', label: 'How to Play', icon: 'help-circle-outline' },
  { id: 'rate_us', label: 'Rate Us', icon: 'star-outline' },
  { id: 'feedback', label: 'Feedback', icon: 'message-text-outline' },
  { id: 'about', label: 'About', icon: 'information-outline' },
];

const STORE_URL =
  Platform.OS === 'ios'
    ? 'https://apps.apple.com'
    : 'https://play.google.com/store';

function HeaderComponent() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const resetGame = useGameStore((s) => s.resetGame);

  const toggleMenu = useCallback(() => {
    setMenuVisible((v) => !v);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const handleMenuPress = useCallback(
    (id: string) => {
      setMenuVisible(false);
      if (id === 'new_game') {
        resetGame();
      } else {
        setTimeout(() => setActiveModal(id as ModalType), 200);
      }
    },
    [resetGame]
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name="dice-multiple-outline"
            size={wp('5.5%')}
            color={Colors.accent.primaryLight}
          />
          <Text style={styles.title}>
            Guess <Text style={styles.titleAccent}>the Number</Text>
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.menuPressed]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={toggleMenu}
        >
          <Entypo name="dots-three-vertical" size={wp('4.5%')} color={Colors.text.secondary} />
        </Pressable>
      </View>

      {/* Dropdown Menu */}
      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={closeMenu}>
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuDropdown}>
                {MENU_ITEMS.map((item, index) => (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.menuItem,
                      pressed && styles.menuItemPressed,
                      index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                    ]}
                    onPress={() => handleMenuPress(item.id)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={wp('5%')}
                      color={Colors.accent.primaryLight}
                    />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Content Modals */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.infoOverlay}
          >
            <TouchableWithoutFeedback>
              <View style={styles.infoCard}>
                {activeModal === 'how_to_play' && <HowToPlayContent onClose={closeModal} />}
                {activeModal === 'difficulty' && <DifficultyContent onClose={closeModal} />}
                {activeModal === 'about' && <AboutContent onClose={closeModal} />}
                {activeModal === 'rate_us' && <RateUsContent onClose={closeModal} />}
                {activeModal === 'feedback' && <FeedbackContent onClose={closeModal} />}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// ── How to Play ──

function HowToPlayContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <MaterialCommunityIcons
        name="lightbulb-on-outline"
        size={wp('10%')}
        color={Colors.accent.gold}
      />
      <Text style={styles.infoTitle}>How to Play</Text>
      <View style={styles.rulesContainer}>
        <RuleItem number="1" text="A secret number between 0-100 is chosen" />
        <RuleItem number="2" text="Type your guess using the keypad" />
        <RuleItem number="3" text="Press Enter to submit your guess" />
        <RuleItem number="4" text="The range bar narrows after each guess" />
        <RuleItem number="5" text="You have 6 attempts to find the number" />
        <RuleItem number="6" text="Guess correctly to win!" />
      </View>
      <CloseBtn onPress={onClose} label="Got it" />
    </>
  );
}

function RuleItem({ number, text }: { number: string; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.ruleBadge}>
        <Text style={styles.ruleBadgeText}>{number}</Text>
      </View>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

// ── About ──

function AboutContent({ onClose }: { onClose: () => void }) {
  return (
    <>
      <MaterialCommunityIcons
        name="dice-multiple-outline"
        size={wp('10%')}
        color={Colors.accent.primaryLight}
      />
      <Text style={styles.infoTitle}>Guess the Number</Text>
      <View style={styles.aboutDetails}>
        <AboutRow label="Version" value="1.0.0" />
      </View>
      <View style={styles.aboutSpacer} />
      <CloseBtn onPress={onClose} label="Got it" />
    </>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.aboutRow}>
      <Text style={styles.aboutLabel}>{label}</Text>
      <Text style={styles.aboutValue}>{value}</Text>
    </View>
  );
}

// ── Difficulty ──

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  easy: 'emoticon-happy-outline',
  medium: 'emoticon-neutral-outline',
  hard: 'emoticon-devil-outline',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.accent.teal,
  medium: Colors.accent.gold,
  hard: Colors.accent.coral,
};

function DifficultyContent({ onClose }: { onClose: () => void }) {
  const currentDifficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);

  const handleSelect = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      onClose();
    },
    [setDifficulty, onClose]
  );

  const levels: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <>
      <MaterialCommunityIcons
        name="speedometer"
        size={wp('10%')}
        color={Colors.accent.primaryLight}
      />
      <Text style={styles.infoTitle}>Difficulty</Text>
      <Text style={styles.diffSubtitle}>Choose your challenge level</Text>

      <View style={styles.diffContainer}>
        {levels.map((d) => {
          const config = DIFFICULTY_CONFIGS[d];
          const isActive = d === currentDifficulty;
          const color = DIFFICULTY_COLORS[d];
          return (
            <Pressable
              key={d}
              style={[
                styles.diffCard,
                isActive && { borderColor: color, backgroundColor: `${color}15` },
              ]}
              onPress={() => handleSelect(d)}
            >
              <View style={styles.diffCardHeader}>
                <MaterialCommunityIcons
                  name={DIFFICULTY_ICONS[d] as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={wp('6%')}
                  color={isActive ? color : Colors.text.muted}
                />
                <Text style={[styles.diffLabel, isActive && { color }]}>
                  {config.label}
                </Text>
                {isActive && (
                  <View style={[styles.diffActiveBadge, { backgroundColor: color }]}>
                    <MaterialCommunityIcons name="check" size={wp('3%')} color="#fff" />
                  </View>
                )}
              </View>
              <Text style={styles.diffDesc}>{config.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={onClose} style={styles.laterButton}>
        <Text style={styles.laterText}>Cancel</Text>
      </Pressable>
    </>
  );
}

// ── Rate Us ──

function RateUsContent({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(4);

  const handleRateOnStore = useCallback(() => {
    Linking.openURL(STORE_URL);
    onClose();
  }, [onClose]);

  const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing!'];

  return (
    <>
      <MaterialCommunityIcons
        name="star-shooting-outline"
        size={wp('10%')}
        color={Colors.accent.gold}
      />
      <Text style={styles.infoTitle}>Rate Us</Text>
      <Text style={styles.rateSubtitle}>How are you enjoying the game?</Text>

      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
            <MaterialCommunityIcons
              name={star <= rating ? 'star' : 'star-outline'}
              size={wp('10%')}
              color={star <= rating ? Colors.accent.gold : Colors.text.muted}
            />
          </Pressable>
        ))}
      </View>

      <Text style={styles.ratingLabel}>{labels[rating - 1]}</Text>

      <Pressable
        style={({ pressed }) => [styles.storeButton, pressed && styles.storeButtonPressed]}
        onPress={handleRateOnStore}
      >
        <MaterialCommunityIcons
          name={Platform.OS === 'ios' ? 'apple' : 'google-play'}
          size={wp('4.5%')}
          color="#ffffff"
        />
        <Text style={styles.storeButtonText}>
          Rate on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
        </Text>
      </Pressable>

      <Pressable onPress={onClose} style={styles.laterButton}>
        <Text style={styles.laterText}>Maybe later</Text>
      </Pressable>
    </>
  );
}

// ── Feedback ──

function FeedbackContent({ onClose }: { onClose: () => void }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(() => {
    if (feedbackText.trim().length === 0) {
      Alert.alert('Oops', 'Please write something before submitting.');
      return;
    }
    setSubmitted(true);
  }, [feedbackText]);

  if (submitted) {
    return (
      <>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={wp('12%')}
          color={Colors.accent.teal}
        />
        <Text style={styles.infoTitle}>Thank you!</Text>
        <Text style={styles.feedbackThanks}>
          Your feedback helps us improve the game.
        </Text>
        <CloseBtn onPress={onClose} label="Close" />
      </>
    );
  }

  return (
    <>
      <MaterialCommunityIcons
        name="message-text-outline"
        size={wp('10%')}
        color={Colors.accent.primaryLight}
      />
      <Text style={styles.infoTitle}>Send Feedback</Text>
      <Text style={styles.feedbackSubtitle}>
        We'd love to hear your thoughts, suggestions, or issues.
      </Text>

      <TextInput
        style={styles.feedbackInput}
        placeholder="Write your feedback here..."
        placeholderTextColor={Colors.text.muted}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        value={feedbackText}
        onChangeText={setFeedbackText}
        maxLength={500}
      />
      <Text style={styles.charCount}>{feedbackText.length}/500</Text>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
          feedbackText.trim().length === 0 && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
      >
        <MaterialCommunityIcons name="send" size={wp('4%')} color="#ffffff" />
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>

      <Pressable onPress={onClose} style={styles.laterButton}>
        <Text style={styles.laterText}>Cancel</Text>
      </Pressable>
    </>
  );
}

// ── Shared Close Button ──

function CloseBtn({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
      onPress={onPress}
    >
      <Text style={styles.closeButtonText}>{label}</Text>
    </Pressable>
  );
}

export const Header = memo(HeaderComponent);

const styles = StyleSheet.create({
  // ── Header bar ──
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
    backgroundColor: Colors.header.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 92, 252, 0.15)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
  },
  title: {
    fontSize: wp('4.8%'),
    fontWeight: '600',
    color: Colors.header.text,
    letterSpacing: 0.5,
  },
  titleAccent: {
    fontWeight: '800',
    color: Colors.accent.primaryLight,
  },
  menuButton: {
    padding: wp('2%'),
    borderRadius: 10,
  },
  menuPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // ── Dropdown ──
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuDropdown: {
    position: 'absolute',
    top: hp('8%'),
    right: wp('4%'),
    backgroundColor: '#1e1b3a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.2)',
    minWidth: wp('52%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
  },
  menuItemPressed: {
    backgroundColor: 'rgba(124, 92, 252, 0.12)',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  menuItemText: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // ── Modal shell ──
  infoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('6%'),
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 24,
    paddingTop: hp('3.5%'),
    paddingBottom: hp('2.5%'),
    paddingHorizontal: wp('7%'),
    alignItems: 'center',
    width: '100%',
    maxWidth: wp('88%'),
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.2)',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  infoTitle: {
    fontSize: wp('5.5%'),
    fontWeight: '800',
    color: Colors.text.primary,
    marginTop: hp('1.5%'),
    marginBottom: hp('1%'),
  },

  // ── Rules ──
  rulesContainer: {
    width: '100%',
    gap: hp('1.2%'),
    marginBottom: hp('2%'),
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  ruleBadge: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: wp('3.5%'),
    backgroundColor: 'rgba(124, 92, 252, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleBadgeText: {
    fontSize: wp('3.2%'),
    fontWeight: '800',
    color: Colors.accent.primaryLight,
  },
  ruleText: {
    flex: 1,
    fontSize: wp('3.4%'),
    color: Colors.text.secondary,
    lineHeight: wp('5%'),
  },

  // ── About ──
  aboutDetails: {
    width: '100%',
    gap: hp('0.8%'),
    marginBottom: hp('1.5%'),
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('0.6%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  aboutLabel: {
    fontSize: wp('3.4%'),
    color: Colors.text.muted,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: wp('3.4%'),
    color: Colors.text.primary,
    fontWeight: '700',
  },
  aboutSpacer: {
    height: hp('0.5%'),
  },

  // ── Difficulty ──
  diffSubtitle: {
    fontSize: wp('3.4%'),
    color: Colors.text.secondary,
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  diffContainer: {
    width: '100%',
    gap: hp('1%'),
    marginBottom: hp('1%'),
  },
  diffCard: {
    flexDirection: 'column',
    padding: wp('4%'),
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  diffCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
    marginBottom: hp('0.3%'),
  },
  diffLabel: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  diffActiveBadge: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    borderRadius: wp('2.75%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffDesc: {
    fontSize: wp('3%'),
    color: Colors.text.muted,
    marginLeft: wp('8.5%'),
  },

  // ── Rate Us ──
  rateSubtitle: {
    fontSize: wp('3.4%'),
    color: Colors.text.secondary,
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: wp('2%'),
    marginBottom: hp('0.8%'),
  },
  ratingLabel: {
    fontSize: wp('3.8%'),
    fontWeight: '700',
    color: Colors.accent.gold,
    marginBottom: hp('2.5%'),
    letterSpacing: 0.5,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  storeButtonPressed: {
    backgroundColor: Colors.accent.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  storeButtonText: {
    color: '#ffffff',
    fontSize: wp('3.8%'),
    fontWeight: '700',
  },
  laterButton: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('6%'),
    marginTop: hp('0.5%'),
  },
  laterText: {
    fontSize: wp('3.3%'),
    color: Colors.text.muted,
    fontWeight: '500',
  },

  // ── Feedback ──
  feedbackSubtitle: {
    fontSize: wp('3.3%'),
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: hp('2%'),
    lineHeight: wp('5%'),
  },
  feedbackInput: {
    width: '100%',
    minHeight: hp('15%'),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.2)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    fontSize: wp('3.5%'),
    color: Colors.text.primary,
    lineHeight: wp('5.2%'),
  },
  charCount: {
    fontSize: wp('2.6%'),
    color: Colors.text.muted,
    alignSelf: 'flex-end',
    marginTop: hp('0.5%'),
    marginBottom: hp('1.5%'),
  },
  feedbackThanks: {
    fontSize: wp('3.4%'),
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: hp('2%'),
    lineHeight: wp('5%'),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 14,
    width: '100%',
    justifyContent: 'center',
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonPressed: {
    backgroundColor: Colors.accent.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: wp('3.8%'),
    fontWeight: '700',
  },

  // ── Shared close button ──
  closeButton: {
    backgroundColor: Colors.accent.primary,
    paddingHorizontal: wp('12%'),
    paddingVertical: hp('1.4%'),
    borderRadius: 14,
    marginTop: hp('0.5%'),
    shadowColor: Colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  closeButtonPressed: {
    backgroundColor: Colors.accent.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: wp('3.8%'),
    fontWeight: '700',
  },
});
