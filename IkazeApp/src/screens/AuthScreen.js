import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { DISTRICTS } from '../data/sites';
import { loginAccount, registerAccount } from '../services/portalStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function AuthScreen({ navigation, route }) {
  const initialRole = route?.params?.initialRole || 'tourist';
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState(initialRole); // 'tourist' | 'guide'
  const [nationality, setNationality] = useState('rwandan');
  const [districtId, setDistrictId] = useState('gasabo');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');

  const routeAfterAuth = (user) => {
    if (user.role === 'guide') {
      navigation.replace('TourGuidePortal', { user });
    } else {
      navigation.replace('TouristPortal', { user });
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (mode === 'login') {
      const res = await loginAccount({ email, password });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      routeAfterAuth(res.user);
    } else {
      const res = await registerAccount({
        fullName,
        email,
        password,
        role,
        nationality,
        districtId,
        licenseId,
        specialty,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      routeAfterAuth(res.user);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    const res = await loginAccount({ email: demoEmail, password: 'ikaze123' });
    if (res.ok) routeAfterAuth(res.user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Urugwiro Tours Account Portal</Text>
        <Text style={styles.headerSub}>
          Sign in as a Tourist or Certified Tour Guide
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Mode Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
            onPress={() => {
              setMode('login');
              setError('');
            }}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
            onPress={() => {
              setMode('register');
              setError('');
            }}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {mode === 'register' && (
            <>
              <Text style={styles.fieldLabel}>Account Type</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleChip, role === 'tourist' && styles.roleChipActive]}
                  onPress={() => setRole('tourist')}
                >
                  <Text style={[styles.roleText, role === 'tourist' && styles.roleTextActive]}>
                    🧳 Tourist
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleChip, role === 'guide' && styles.roleChipActive]}
                  onPress={() => setRole('guide')}
                >
                  <Text style={[styles.roleText, role === 'guide' && styles.roleTextActive]}>
                    🧭 Tour Guide
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Jean Paul Habimana"
                placeholderTextColor={COLORS.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />

              {role === 'tourist' && (
                <>
                  <Text style={styles.fieldLabel}>Nationality</Text>
                  <View style={styles.roleRow}>
                    <TouchableOpacity
                      style={[
                        styles.roleChip,
                        nationality === 'rwandan' && styles.roleChipActive,
                      ]}
                      onPress={() => setNationality('rwandan')}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          nationality === 'rwandan' && styles.roleTextActive,
                        ]}
                      >
                        🇷🇼 Rwandan
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleChip,
                        nationality === 'foreigner' && styles.roleChipActive,
                      ]}
                      onPress={() => setNationality('foreigner')}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          nationality === 'foreigner' && styles.roleTextActive,
                        ]}
                      >
                        ✈️ Foreigner
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {nationality === 'rwandan' && (
                    <>
                      <Text style={styles.fieldLabel}>Home District</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ marginBottom: SPACING.md }}
                      >
                        <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                          {DISTRICTS.map((d) => (
                            <TouchableOpacity
                              key={d.id}
                              style={[
                                styles.miniChip,
                                districtId === d.id && styles.miniChipActive,
                              ]}
                              onPress={() => setDistrictId(d.id)}
                            >
                              <Text
                                style={[
                                  styles.miniChipText,
                                  districtId === d.id && styles.miniChipTextActive,
                                ]}
                              >
                                {d.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </>
                  )}
                </>
              )}

              {role === 'guide' && (
                <>
                  <Text style={styles.fieldLabel}>RDB Guide License No. (optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. RDB-TG-2041"
                    placeholderTextColor={COLORS.textMuted}
                    value={licenseId}
                    onChangeText={setLicenseId}
                  />
                  <Text style={styles.fieldLabel}>Specialty</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Gorilla Trekking, Akagera, Kigali History"
                    placeholderTextColor={COLORS.textMuted}
                    value={specialty}
                    onChangeText={setSpecialty}
                  />
                </>
              )}
            </>
          )}

          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {mode === 'login' ? 'Sign In to Urugwiro Tours →' : 'Create Account & Enter →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Accounts */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>⚡ Quick Demo Access (Test Both Portals)</Text>
          <Text style={styles.demoSub}>
            Try inviting a tourist as a Tour Guide, or receiving guide info as a Tourist:
          </Text>
          <View style={styles.demoBtns}>
            <TouchableOpacity
              style={[styles.demoBtn, { backgroundColor: COLORS.accent }]}
              onPress={() => handleDemoLogin('guide@ikaze.rw')}
            >
              <Text style={styles.demoBtnText}>🧭 Enter as Tour Guide (guide@ikaze.rw)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoBtn, { backgroundColor: COLORS.primary }]}
              onPress={() => handleDemoLogin('tourist@ikaze.rw')}
            >
              <Text style={styles.demoBtnText}>🧳 Enter as Tourist (tourist@ikaze.rw)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  backBtn: { marginBottom: SPACING.sm },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.sm },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.heavy,
    color: COLORS.textOnPrimary,
  },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  body: { padding: SPACING.md, gap: SPACING.md },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtn: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: RADIUS.sm },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.textOnPrimary },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  fieldLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  roleRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  roleChip: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  roleText: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.textSecondary },
  roleTextActive: { color: COLORS.primaryDark },
  miniChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  miniChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  miniChipText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  miniChipTextActive: { color: COLORS.textOnPrimary, fontWeight: FONTS.weights.bold },
  errorText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.sm,
    fontWeight: FONTS.weights.medium,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOW.card,
  },
  submitText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  demoCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    ...SHADOW.card,
  },
  demoTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  demoSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.sm },
  demoBtns: { gap: SPACING.sm },
  demoBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  demoBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
});
