import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { DISTRICTS, SITES } from '../data/sites';
import {
  DELIVERABLE_TYPES,
  acceptInvitationByCode,
  getDeliverablesForInvitation,
  getTouristInvitations,
  logoutAccount,
} from '../services/portalStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function TouristPortalScreen({ navigation, route }) {
  const { user } = route.params;

  const [invitations, setInvitations] = useState([]);
  const [deliverablesByInvite, setDeliverablesByInvite] = useState({});
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinMsg, setJoinMsg] = useState('');

  const loadPortal = async () => {
    const list = await getTouristInvitations(user.email);
    setInvitations(list);
    const map = {};
    for (const inv of list) {
      map[inv.id] = await getDeliverablesForInvitation(inv.id);
    }
    setDeliverablesByInvite(map);
  };

  useEffect(() => {
    loadPortal();
  }, []);

  const handleJoinCode = async () => {
    setJoinMsg('');
    const res = await acceptInvitationByCode({
      code: inviteCodeInput,
      touristEmail: user.email,
    });
    if (!res.ok) {
      setJoinMsg(res.error);
      return;
    }
    setInviteCodeInput('');
    setJoinMsg(`✓ Joined "${res.invitation.tripTitle}" from ${res.invitation.guideName}!`);
    await loadPortal();
  };

  const handleExploreSites = () => {
    if (user.nationality === 'rwandan') {
      const dist = DISTRICTS.find((d) => d.id === user.districtId) || DISTRICTS[0];
      navigation.navigate('RwandanHome', { district: dist });
    } else {
      navigation.navigate('ForeignerHome');
    }
  };

  const handleLogout = async () => {
    await logoutAccount();
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>🧳 My Tour Guide Portal</Text>
        <Text style={styles.headerSub}>
          {user.fullName} · {user.email}
        </Text>
        <TouchableOpacity style={styles.exploreBtn} onPress={handleExploreSites}>
          <Text style={styles.exploreBtnText}>
            🌍 Open My Rwanda Destinations ({user.nationality === 'rwandan' ? 'District View' : 'Full Directory'}) →
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Join by Invite Code */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎟️ Join Tour Guide Invitation</Text>
          <Text style={styles.cardSub}>
            Received an email invite from your Tour Guide? Enter your invite code (e.g. UGT-2026) below:
          </Text>
          <View style={styles.joinRow}>
            <TextInput
              style={styles.codeInput}
              placeholder="Enter code (e.g. UGT-2026)"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
              value={inviteCodeInput}
              onChangeText={setInviteCodeInput}
            />
            <TouchableOpacity style={styles.joinBtn} onPress={handleJoinCode}>
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
          {joinMsg ? <Text style={styles.joinMsg}>{joinMsg}</Text> : null}
        </View>

        {/* Active Guide Invitations & Deliverables */}
        {invitations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 40, marginBottom: SPACING.sm }}>📬</Text>
            <Text style={styles.emptyTitle}>No Guide Invitations Yet</Text>
            <Text style={styles.emptySub}>
              Ask your Rwanda Tour Guide to invite {user.email} from their Tour Guide Portal, or enter an invite code above.
            </Text>
          </View>
        ) : (
          invitations.map((inv) => {
            const items = deliverablesByInvite[inv.id] || [];
            return (
              <View key={inv.id} style={styles.card}>
                <View style={styles.invHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invBadge}>
                      🧭 GUIDE PORTAL · {inv.inviteCode}
                    </Text>
                    <Text style={styles.invTrip}>{inv.tripTitle}</Text>
                    <Text style={styles.invGuide}>
                      Guide: {inv.guideName} ({inv.guideLicense})
                    </Text>
                  </View>
                </View>

                <Text style={styles.personalNote}>{inv.personalNote}</Text>

                <Text style={styles.sectionLabel}>
                  📦 Delivered by Your Guide ({items.length})
                </Text>

                {items.length === 0 ? (
                  <Text style={styles.noItemsText}>
                    Your guide has not delivered items yet. Check back soon!
                  </Text>
                ) : (
                  items.map((item) => {
                    const typeMeta = DELIVERABLE_TYPES.find((t) => t.id === item.type);
                    const linkedSite = SITES.find((s) => s.id === item.siteId);
                    return (
                      <View key={item.id} style={styles.deliverableCard}>
                        <Text style={styles.delType}>
                          {typeMeta?.emoji || '📌'} {typeMeta?.label || 'Guide Note'}
                        </Text>
                        <Text style={styles.delTitle}>{item.title}</Text>
                        <Text style={styles.delMessage}>{item.message}</Text>

                        <View style={styles.delActions}>
                          {item.videoUrl ? (
                            <TouchableOpacity
                              style={styles.videoChipBtn}
                              onPress={() => Linking.openURL(item.videoUrl)}
                            >
                              <Text style={styles.videoChipText}>▶ Watch Guide Video</Text>
                            </TouchableOpacity>
                          ) : null}

                          {linkedSite ? (
                            <>
                              <TouchableOpacity
                                style={styles.navChipBtn}
                                onPress={() =>
                                  navigation.navigate('NavigationDashboard', {
                                    site: linkedSite,
                                    isLocal: user.nationality === 'rwandan',
                                  })
                                }
                              >
                                <Text style={styles.navChipText}>
                                  🧭 Navigate to {linkedSite.name}
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.detailChipBtn}
                                onPress={() =>
                                  navigation.navigate('SiteDetail', {
                                    site: linkedSite,
                                    isLocal: user.nationality === 'rwandan',
                                  })
                                }
                              >
                                <Text style={styles.detailChipText}>Site Info</Text>
                              </TouchableOpacity>
                            </>
                          ) : null}
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.sm },
  logoutText: { color: COLORS.secondary, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.heavy, color: '#fff' },
  headerSub: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  exploreBtn: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  exploreBtnText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  body: { padding: SPACING.md, gap: SPACING.md },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  cardTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  cardSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.sm },
  joinRow: { flexDirection: 'row', gap: SPACING.sm },
  codeInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  joinBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  joinBtnText: { color: '#fff', fontWeight: FONTS.weights.bold },
  joinMsg: { marginTop: SPACING.sm, fontSize: FONTS.sizes.xs, color: COLORS.primaryDark, fontWeight: FONTS.weights.bold },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.card,
  },
  emptyTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  emptySub: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
  invHeader: { flexDirection: 'row', alignItems: 'center' },
  invBadge: { fontSize: FONTS.sizes.xs, color: COLORS.accent, fontWeight: FONTS.weights.heavy },
  invTrip: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.heavy, color: COLORS.textPrimary, marginTop: 2 },
  invGuide: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  personalNote: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    marginVertical: SPACING.md,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  noItemsText: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  deliverableCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  delType: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, color: COLORS.accent },
  delTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary, marginTop: 4 },
  delMessage: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  delActions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  videoChipBtn: {
    backgroundColor: '#8B1A1A',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  videoChipText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  navChipBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  navChipText: { color: '#fff', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },
  detailChipBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailChipText: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
});
