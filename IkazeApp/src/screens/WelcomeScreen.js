import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.content}>
        <Text style={styles.brand}>URUGWIRO TOURS</Text>
        <Text style={styles.title}>Discover Rwanda</Text>
        <Text style={styles.subtitle}>
          Find destinations, plan your visit, and connect with local tour guides.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Auth', { initialRole: 'tourist' })}
        >
          <Text style={styles.primaryButtonText}>Continue as a Tourist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Auth', { initialRole: 'guide' })}
        >
          <Text style={styles.secondaryButtonText}>Continue as a Tour Guide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryDark },
  content: { flex: 1, justifyContent: 'center', padding: SPACING.xl },
  brand: { color: COLORS.secondary, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.heavy, letterSpacing: 4 },
  title: { color: '#fff', fontSize: FONTS.sizes.hero, fontWeight: FONTS.weights.heavy, marginTop: SPACING.sm },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.md, lineHeight: 24, marginTop: SPACING.sm, marginBottom: SPACING.xl },
  primaryButton: { backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  primaryButtonText: { color: COLORS.primaryDark, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  secondaryButton: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)', borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  secondaryButtonText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
});
