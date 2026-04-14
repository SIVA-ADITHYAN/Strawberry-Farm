import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const TOTAL_CARDS = 5;

/* ── Blueberry palette (same as web) ────────────────────────────── */
const B = {
  primary: '#5B3EA6',
  light:   '#9B7BC8',
  amber:   '#C18C5D',
  dark:    '#1E1A2E',
  muted:   '#6B6880',
  border:  'rgba(91,62,166,0.22)',
  bg:      'rgba(91,62,166,0.07)',
};

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS  = Platform.OS === 'ios' ? 'System'  : 'sans-serif';

/* ── Data (same as web) ─────────────────────────────────────────── */
const steps = [
  { emoji: '🌱', accent: B.primary, label: 'Organically Grown',   desc: "Camarosa variety cultivated in Kodaikanal's cool climate with zero synthetic inputs." },
  { emoji: '✋', accent: B.amber,   label: 'Hand-Harvested',       desc: 'Each berry is picked by hand at peak ripeness — never machine-harvested.' },
  { emoji: '📦', accent: B.primary, label: 'Inspected & Sorted',   desc: 'Every batch is visually inspected and sorted for size, colour, and quality.' },
  { emoji: '🚚', accent: B.amber,   label: 'Delivered in 24 hrs',  desc: 'Packed in food-grade boxes and dispatched the same day — farm fresh at your door.' },
];

const labResults = [
  { label: 'Pesticide Residue', result: '< LOQ',          note: 'Below limit of quantification — effectively zero' },
  { label: 'LCMS-MS Panel',     result: 'All Clear',       note: '70+ compounds tested — none detected' },
  { label: 'GCMS-MS Panel',     result: 'All Clear',       note: '60+ compounds tested — none detected' },
  { label: 'Test Method',       result: 'FSRL-PR-SOP-09',  note: 'ICAR-IIHR accredited protocol' },
];

const promise = [
  { emoji: '🌱', stat: 'Organically\nGrown', label: 'No Chemicals',  desc: 'No pesticides, herbicides, or synthetic fertilisers — ever.' },
  { emoji: '🏆', stat: 'ICAR',               label: 'Certified',     desc: 'Farming practices validated by ICAR-recommended guidelines.' },
  { emoji: '🍃', stat: '24 hr',              label: 'Farm to Table', desc: 'Shortest possible supply chain — no cold-storage middlemen.' },
];



/* ── Back button ─────────────────────────────────────────────────── */
const BackBtn = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{ flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: B.border,
      borderRadius: 99, paddingVertical: 6, paddingHorizontal: 14, alignSelf: 'flex-start' }}
  >
    <Text style={{ fontSize: 15 }}>←</Text>
    <Text style={{ fontSize: 11, color: B.primary, fontWeight: '700', fontFamily: SANS }}>
      Our Story
    </Text>
  </TouchableOpacity>
);

/* ── PDF card ────────────────────────────────────────────────────── */
const PdfCard = ({ pageNumber, pdfUri }: { pageNumber: number; pdfUri: string | null }) => {
  if (!pdfUri) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 24 }}>🧪</Text>
        <Text style={{ fontSize: 11, color: B.muted, fontFamily: SANS }}>Loading…</Text>
      </View>
    );
  }

  // iOS renders PDFs natively in WebView; on Android use a fallback HTML page
  if (Platform.OS === 'ios') {
    return (
      <WebView
        source={{ uri: `${pdfUri}#page=${pageNumber}` }}
        style={{ flex: 1, borderRadius: 16 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  // Android/Web fallback: styled official summary card
  return (
    <View style={{ flex: 1, backgroundColor: '#FBFAFF', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'white',
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
        shadowColor: B.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 32 }}>📄</Text>
      </View>
      <Text style={{ fontSize: 13, color: B.primary, fontWeight: '700',
        letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8, fontFamily: SANS }}>
        Official Certificate
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: B.dark, textAlign: 'center',
        marginBottom: 12, fontFamily: SERIF, lineHeight: 28 }}>
        Lab Analysis Summary{'\n'}Page {pageNumber}
      </Text>
      <View style={{ width: 40, height: 2, backgroundColor: B.border, marginBottom: 16 }} />
      <Text style={{ fontSize: 13, color: B.muted, textAlign: 'center', lineHeight: 22,
        fontFamily: SERIF, maxWidth: 220 }}>
        Report No: FSRL2026-62{'\n'}
        Analysed 08–11 Apr 2026{'\n'}
        ICAR-IIHR Accredited
      </Text>

      <TouchableOpacity
        onPress={() => pdfUri && Linking.openURL(pdfUri)}
        style={{ marginTop: 24, paddingVertical: 10, paddingHorizontal: 20,
          backgroundColor: 'white', borderWidth: 1, borderColor: B.border, borderRadius: 12 }}
      >
        <Text style={{ fontSize: 11, color: B.primary, fontWeight: '700', fontFamily: SANS }}>
          VIEW FULL PDF
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* ═══════════════════════════════════════════════════════════════════ */

type Props = NativeStackScreenProps<RootStackParamList, 'Process'>;

export default function ProcessScreen({ navigation }: Props) {
  const { height: SCREEN_H, width: SCREEN_W } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [activeCard, setActiveCard] = useState(0);
  const isAnimating = useRef(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  const colW = Math.min(SCREEN_W, 480);

  /* Load PDF asset */
  useEffect(() => {
    Asset.loadAsync(require('../assets/lab-report.pdf')).then(([asset]) => {
      setPdfUri(asset.localUri ?? null);
    }).catch(() => {});
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_CARDS - 1, index));
    if (clamped === activeCard || isAnimating.current) return;
    isAnimating.current = true;
    scrollRef.current?.scrollTo({ y: clamped * SCREEN_H, animated: true });
    setActiveCard(clamped);
    setTimeout(() => { isAnimating.current = false; }, 600);
  }, [activeCard, SCREEN_H]);

  const goBackToStory = () => navigation.goBack();

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / SCREEN_H);
    setActiveCard(idx);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}>
      <View style={{ width: colW, flex: 1, position: 'relative' }}>

        <ScrollView
          ref={scrollRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd}
          style={{ flex: 1 }}
        >
          {/* ══ CARD 1 ─ From Farm to Table ════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>
            <View style={{ flex: 1, paddingHorizontal: 24,
              paddingTop: insets.top + 56, paddingBottom: 40 }}>
              <View style={{ marginBottom: 16 }}>
                <BackBtn onPress={goBackToStory} />
              </View>

              <Text style={{ textAlign: 'center', marginBottom: 4, fontSize: 11, color: B.amber,
                letterSpacing: 5.1, textTransform: 'uppercase', fontFamily: SANS, fontWeight: '600' }}>
                Behind the scenes
              </Text>
              <Text style={{ textAlign: 'center', marginBottom: 24, fontSize: 24, fontWeight: '700',
                color: B.dark, lineHeight: 30, fontFamily: SERIF }}>
                From Farm to Table
              </Text>

              <View style={{ gap: 24, paddingBottom: 20 }}>
                {steps.map(({ emoji, accent, label, desc }, i) => (
                  <View key={label} style={{ alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24,
                      backgroundColor: accent, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 20 }}>{emoji}</Text>
                    </View>
                    <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                      <Text style={{ fontSize: 17, fontWeight: '700', color: B.dark,
                        marginBottom: 4, fontFamily: SERIF, textAlign: 'center' }}>{label}</Text>
                      <Text style={{ fontSize: 14, color: B.muted, lineHeight: 20,
                        fontFamily: SERIF, textAlign: 'center' }}>{desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

          </View>

          {/* ══ CARD 2 ─ Lab Report Summary ════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>
            <View style={{ flex: 1, paddingHorizontal: 24,
              paddingTop: insets.top + 56, paddingBottom: 40 }}>
              <View style={{ marginBottom: 16 }}>
                <BackBtn onPress={goBackToStory} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16,
                  backgroundColor: B.bg, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14 }}>🧪</Text>
                </View>
                <Text style={{ fontSize: 11, color: B.primary, fontWeight: '700',
                  letterSpacing: 5.1, textTransform: 'uppercase', fontFamily: SANS }}>
                  Lab Certified
                </Text>
              </View>

              <Text style={{ fontSize: 20, fontWeight: '700', color: B.dark,
                marginBottom: 4, fontFamily: SERIF }}>Lab Report</Text>
              <Text style={{ fontSize: 11, color: '#555550', fontWeight: '600',
                marginBottom: 2, fontFamily: SANS }}>
                Report No: FSRL2026-62 · 13 Apr 2026
              </Text>
              <Text style={{ fontSize: 11, color: B.muted, marginBottom: 20, fontFamily: SANS }}>
                Sample: Strawberry (1 kg) · Analysed 08–11 Apr 2026
              </Text>

              <View style={{ flex: 1, justifyContent: 'center', gap: 10 }}>
                {labResults.map(({ label, result, note }) => (
                  <View key={label}
                    style={{ flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12,
                      backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: B.border,
                      borderRadius: 18 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 10, color: B.muted, letterSpacing: 1.9,
                        textTransform: 'uppercase', marginBottom: 4, fontFamily: SANS }}>
                        {label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: B.dark,
                        lineHeight: 22, marginBottom: 4, fontFamily: SERIF }}>{result}</Text>
                      <Text style={{ fontSize: 13, color: B.muted, lineHeight: 20, fontFamily: SANS }}>{note}</Text>
                    </View>
                    <Text style={{ fontSize: 20, color: B.primary, marginLeft: 12 }}>✓</Text>
                  </View>
                ))}
              </View>

              <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center',
                gap: 10, paddingHorizontal: 16, paddingVertical: 12,
                borderWidth: 1.5, borderColor: B.border, borderRadius: 12, alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: 13 }}>🧪</Text>
                <View>
                  <Text style={{ fontSize: 11, color: B.primary, fontWeight: '700',
                    fontFamily: SANS }}>Food Safety Referral Laboratory</Text>
                  <Text style={{ fontSize: 10, color: B.muted, fontFamily: SANS }}>
                    ICAR-IIHR, Bangalore · TC-16406 Accredited
                  </Text>
                </View>
              </View>
            </View>

          </View>

          {/* ══ CARD 3 ─ Lab PDF Page 1 ════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>
            <View style={{ flex: 1, paddingHorizontal: 20,
              paddingTop: insets.top + 44, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12 }}>
                <BackBtn onPress={goBackToStory} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14,
                    backgroundColor: B.bg, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>🧪</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, color: B.amber, fontWeight: '700',
                      letterSpacing: 3.5, textTransform: 'uppercase', fontFamily: SANS }}>
                      Page 1 of 2
                    </Text>
                    <Text style={{ fontSize: 10, color: B.muted, fontFamily: SANS }}>
                      FSRL2026-40
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1, borderWidth: 1.5, borderColor: B.border,
                borderRadius: 16, overflow: 'hidden',
                shadowColor: B.primary, shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.14, shadowRadius: 10, elevation: 4 }}>
                <PdfCard pageNumber={1} pdfUri={pdfUri} />
              </View>

              <Text style={{ marginTop: 8, textAlign: 'center', fontSize: 10,
                color: B.muted, opacity: 0.6, fontFamily: SANS }}>
                TC-16406 Accredited · Analysed 08–11 Apr 2026
              </Text>
            </View>

          </View>

          {/* ══ CARD 4 ─ Lab PDF Page 2 ════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H }]}>
            <View style={{ flex: 1, paddingHorizontal: 20,
              paddingTop: insets.top + 44, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 12 }}>
                <BackBtn onPress={goBackToStory} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14,
                    backgroundColor: 'rgba(193,140,93,0.10)',
                    justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12 }}>🧪</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 10, color: B.amber, fontWeight: '700',
                      letterSpacing: 3.5, textTransform: 'uppercase', fontFamily: SANS }}>
                      Page 2 of 2
                    </Text>
                    <Text style={{ fontSize: 10, color: B.muted, fontFamily: SANS }}>
                      FSRL2026-40
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1, borderWidth: 1.5,
                borderColor: 'rgba(193,140,93,0.22)', borderRadius: 16, overflow: 'hidden',
                shadowColor: B.amber, shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 }}>
                <PdfCard pageNumber={2} pdfUri={pdfUri} />
              </View>

              <Text style={{ marginTop: 8, textAlign: 'center', fontSize: 10,
                color: B.muted, opacity: 0.6, fontFamily: SANS }}>
                TC-16406 Accredited · Report issued 13 Apr 2026
              </Text>
            </View>

          </View>

          {/* ══ CARD 5 ─ Our Commitment ════════════════════════════ */}
          <View style={[sty.card, { height: SCREEN_H, paddingHorizontal: 24,
            paddingTop: insets.top + 56, paddingBottom: insets.bottom + 32 }]}>
            <View style={{ marginBottom: 16 }}>
              <BackBtn onPress={goBackToStory} />
            </View>

            <Text style={{ textAlign: 'center', marginBottom: 4, fontSize: 11,
              color: B.amber, letterSpacing: 5.1, textTransform: 'uppercase',
              fontFamily: SANS, fontWeight: '600' }}>
              Our Promise
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700',
              color: B.dark, marginBottom: 8, fontFamily: SERIF }}>
              Our Commitment
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 12, color: B.muted,
              lineHeight: 18, maxWidth: 230, alignSelf: 'center', marginBottom: 24,
              fontFamily: SERIF }}>
              Every berry reflects a commitment to purity, quality, and your family's health.
            </Text>

            <View style={{ flex: 1, justifyContent: 'center', gap: 12 }}>
              {promise.map(({ emoji, stat, label, desc }) => (
                <View key={label}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 16,
                    paddingHorizontal: 15, paddingVertical: 13,
                    backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: B.border,
                    borderRadius: 20,
                    shadowColor: B.primary, shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12, shadowRadius: 9, elevation: 3 }}>
                  <View style={{ width: 58, alignItems: 'center', flexShrink: 0 }}>
                    <Text style={{ fontSize: 16, marginBottom: 3 }}>{emoji}</Text>
                    <Text style={{ fontSize: 11, color: B.dark, fontWeight: '800',
                      lineHeight: 14, textAlign: 'center',
                      fontFamily: SANS }}>{stat}</Text>
                    <Text style={{ fontSize: 10, color: B.muted, textTransform: 'uppercase',
                      letterSpacing: 1.5, textAlign: 'center', marginTop: 2,
                      fontFamily: SANS }}>{label}</Text>
                  </View>
                  <View style={{ width: 1, height: 38, backgroundColor: B.border, flexShrink: 0 }} />
                  <Text style={{ flex: 1, fontSize: 12, color: B.dark, lineHeight: 18,
                    fontFamily: SERIF }}>{desc}</Text>
                </View>
              ))}
            </View>

            {/* Big back button */}
            <TouchableOpacity
              onPress={goBackToStory}
              activeOpacity={0.88}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 8, width: '100%', marginTop: 24, backgroundColor: B.primary,
                borderRadius: 14, paddingVertical: 14,
                shadowColor: B.primary, shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.38, shadowRadius: 10, elevation: 6 }}
            >
              <Text style={{ color: 'white', fontSize: 15 }}>←</Text>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '700',
                letterSpacing: 0.6, fontFamily: SANS }}>
                Back to Our Story
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    </View>
  );
}

const sty = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
});
