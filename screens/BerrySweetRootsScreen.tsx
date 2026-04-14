import React, { useRef, useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Platform,
  Animated,
  ViewStyle,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const FONT = Platform.OS === 'ios' ? 'System' : 'sans-serif';

/* ── Fade-in section ─────────────────────────────────────────────── */
const FadeSection = ({
  children, style,
}: { children: ReactNode; style?: ViewStyle }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(22)).current;
  const triggered = useRef(false);

  const onLayout = () => {
    if (triggered.current) return;
    triggered.current = true;
    Animated.parallel([
      Animated.timing(opacity,     { toValue: 1, duration: 850, useNativeDriver: true }),
      Animated.timing(translateY,  { toValue: 0, duration: 850, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View
      onLayout={onLayout}
      style={[{ opacity, transform: [{ translateY }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

/* ── Label ───────────────────────────────────────────────────────── */
const Label = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 10, fontWeight: '600', letterSpacing: 3.5,
    textTransform: 'uppercase', color: '#C0392B', marginBottom: 14,
    textAlign: 'center', fontFamily: FONT }}>
    {children}
  </Text>
);

/* ── Thin rule ───────────────────────────────────────────────────── */
const Rule = () => (
  <View style={{ width: 32, height: 1.5, backgroundColor: '#E5E5E5',
    alignSelf: 'center', borderRadius: 2, marginBottom: 22 }} />
);

/* ── Section ─────────────────────────────────────────────────────── */
const Section = ({ id, children }: { id?: string; children: ReactNode }) => {
  const { height } = useWindowDimensions();
  return (
    <FadeSection style={{ minHeight: height, justifyContent: 'center',
      alignItems: 'center', paddingHorizontal: 28, paddingVertical: 100 }}>
      <View style={{ width: '100%', maxWidth: 600 }}>
        {children}
      </View>
    </FadeSection>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */

type Props = NativeStackScreenProps<RootStackParamList, 'BerrySweetRoots'>;

export default function BerrySweetRootsScreen({ navigation }: Props) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bodyStyle = {
    fontSize: 16, color: '#666', lineHeight: 28,
    fontFamily: FONT, textAlign: 'center' as const,
  };

  const headingLg = {
    fontSize: Math.min(Math.max(width * 0.11, 41.6), 70.4),
    fontWeight: '800' as const,
    letterSpacing: -1.5,
    lineHeight: Math.min(Math.max(width * 0.11, 41.6), 70.4) * 1.25,
    color: '#0a0a0a',
    marginBottom: 24,
    fontFamily: FONT,
    textAlign: 'center' as const,
  };

  const headingMd = {
    fontSize: Math.min(Math.max(width * 0.055, 26.4), 36),
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: Math.min(Math.max(width * 0.055, 26.4), 36) * 1.4,
    color: '#0a0a0a',
    marginBottom: 20,
    fontFamily: FONT,
    textAlign: 'center' as const,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* ══ HERO ════════════════════════════════════════════════ */}
        <View style={{ minHeight: height, justifyContent: 'center', alignItems: 'center',
          paddingHorizontal: 28, paddingTop: 100 + insets.top, paddingBottom: 80,
          position: 'relative' }}>
          <View style={{ width: '100%', maxWidth: 600, alignItems: 'center' }}>
            {/* Brand mark */}
            <Text style={{ fontSize: 38, lineHeight: 46, marginBottom: 32 }}>🍓</Text>

            {/* Eyebrow */}
            <Text style={{ fontSize: 10, fontWeight: '600', letterSpacing: 3.5,
              textTransform: 'uppercase', color: '#C0392B', marginBottom: 20,
              fontFamily: FONT, textAlign: 'center' }}>
              Kodaikanal, India
            </Text>

            {/* Main heading */}
            <Text style={[headingLg, { marginBottom: 22 }]}>
              Berry Sweet Roots
            </Text>

            {/* Subtext */}
            <Text style={{ fontSize: 17, color: '#666', lineHeight: 29,
              maxWidth: 380, textAlign: 'center', marginBottom: 48,
              fontFamily: FONT }}>
              Grown in Kodaikanal. Pure, organic strawberries cultivated with care.
            </Text>

            {/* CTA */}
            <TouchableOpacity
              style={sty.btnOutline}
              onPress={() => {/* scroll to contact handled by ScrollView */}}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#111',
                fontFamily: FONT }}>
                Order Fresh  ↓
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scroll-down line */}
          <View style={{ position: 'absolute', bottom: 28, left: '50%',
            marginLeft: -0.5, width: 1, height: 56,
            backgroundColor: 'rgba(212,212,212,0.7)' }} />
        </View>

        {/* ══ ABOUT ═══════════════════════════════════════════════ */}
        <Section id="about">
          <Label>About</Label>
          <Rule />
          <Text style={headingMd}>Grown with intention.</Text>
          <Text style={bodyStyle}>
            We work directly with farmers to grow strawberries naturally.
            No pesticides. No shortcuts.{'\n\n'}
            Just clean, honest farming — from seed to basket.
          </Text>
        </Section>

        {/* ══ VARIETY ═════════════════════════════════════════════ */}
        <Section id="variety">
          <Label>The Berry</Label>
          <Rule />
          {/* Big typographic heading */}
          <Text style={{
            fontSize: Math.min(Math.max(width * 0.18, 64), 128),
            fontWeight: '800',
            letterSpacing: -3,
            lineHeight: Math.min(Math.max(width * 0.18, 64), 128) * 0.92,
            color: '#0a0a0a',
            marginBottom: 24,
            fontFamily: FONT,
            textAlign: 'center',
          }}>
            Camarosa
          </Text>
          <Text style={bodyStyle}>
            Known for its richness, freshness, and natural sweetness.
            The variety that delivers — every single time.
          </Text>
        </Section>

        {/* ══ WHY ═════════════════════════════════════════════════ */}
        <Section id="why">
          <Label>Why It Matters</Label>
          <Rule />
          <Text style={headingMd}>
            Strawberries are on{'\n'}the dirty dozen.
          </Text>
          <Text style={bodyStyle}>
            Conventionally grown strawberries carry more pesticide residue than
            almost any other produce.{'\n\n'}
            We believe clean food should be accessible to everyone — not just the few.
          </Text>
        </Section>

        {/* ══ MISSION ═════════════════════════════════════════════ */}
        <Section id="mission">
          <Label>Our Mission</Label>
          <Rule />
          <Text style={headingMd}>Real food for real families.</Text>
          <Text style={bodyStyle}>
            Clean eating for families, kids, and everyone who loves berries.
            From our farm in Kodaikanal to your table —
            freshness you can actually taste.
          </Text>
        </Section>

        {/* ══ CTA ═════════════════════════════════════════════════ */}
        <Section id="contact">
          <Text style={[headingLg, { marginBottom: 20 }]}>
            Eat Clean.{'\n'}Eat Real.
          </Text>
          <Text style={{ fontSize: 15, color: '#999', lineHeight: 25,
            marginBottom: 40, textAlign: 'center', fontFamily: FONT }}>
            Order fresh Camarosa strawberries from Kodaikanal.
          </Text>

          <View style={{ gap: 12, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://wa.me/')}
              activeOpacity={0.75}
              style={[sty.btnFill, { width: 220, justifyContent: 'center' }]}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff',
                fontFamily: FONT, textAlign: 'center' }}>
                WhatsApp to Order
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:hello@berrysweetroots.in')}
              activeOpacity={0.75}
              style={[sty.btnOutline, { width: 220, justifyContent: 'center' }]}
            >
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#111',
                fontFamily: FONT, textAlign: 'center' }}>
                Send an Email
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* ══ FOOTER ══════════════════════════════════════════════ */}
        <View style={{ padding: 40, alignItems: 'center',
          borderTopWidth: 1, borderTopColor: '#F2F2F2',
          paddingBottom: insets.bottom + 40 }}>
          <Text style={{ fontSize: 11, color: '#C0C0C0', letterSpacing: 1.6,
            fontFamily: FONT }}>
            © Berry Sweet Roots · Kodaikanal
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const sty = StyleSheet.create({
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderWidth: 1.5,
    borderColor: '#111',
    borderRadius: 999,
    alignSelf: 'center',
  },
  btnFill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 36,
    backgroundColor: '#111',
    borderRadius: 999,
    alignSelf: 'center',
  },
});
