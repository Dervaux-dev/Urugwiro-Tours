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
} from 'react-native';
import { SITES } from '../data/sites';
import {
  DELIVERABLE_TYPES,
  deliverToTourist,
  getDeliverablesForInvitation,
  getGuideInvitations,
  inviteTouristByEmail,
  logoutAccount,
  sendInvitationEmailApp,
} from '../services/portalStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function TourGuidePortalScreen({ navigation, route }) {
  const { user } = route.params;

  const [invitations, setInvitations] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [deliverables, setDeliverables] = useState([]);

  // Invite form
  const [touristEmail, setTouristEmail] = useState('');
  const [touristName, setTouristName] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [personalNote, setPersonalNote] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');

  // Deliverable form
  const [itemType, setItemType] = useState('site_info');
  const [itemTitle, setItemTitle] = useState('');
  const [itemMessage, setItemMessage] = useState('');
  const [itemSiteId, setItemSiteId] = useState('volcanoes_np');
  const [itemVideoUrl, setItemVideoUrl] = useState('');
  const [deliverFeedback, setDeliverFeedback] = useState('');

  const loadInvites = async () => {
    const list = await getGuideInvitations(user.email);
    setInvitations(list);
    if (list.length > 0 && !selectedInvite) {
      setSelectedInvite(list[0]);
      const dels = await getDeliverablesForInvitation(list[0].id);
      setDeliverables(dels);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const selectInvitation = async (inv) => {
    setSelectedInvite(inv);
    setDeliverFeedback('');
    const dels = await getDeliverablesForInvitation(inv.id);
    setDeliverables(dels);
  };

  const handleInvite = async (alsoOpenEmail) => {
    setInviteFeedback('');
    const res = await inviteTouristByEmail({
      guide: user,
      touristEmail,
      touristName,
      tripTitle,
      personalNote,
    });
    if (!res.ok) {
      setInviteFeedback(res.error);
      return;
    }

    setTouristEmail('');
    setTouristName('');
    setTripTitle('');
    setPersonalNote('');
    setInviteFeedback(
      `✓ Invited ${res.invitation.touristEmail} (Code: ${res.invitation.inviteCode})`
    );
    await loadInvites();
    await selectInvitation(res.invitation);

    if (alsoOpenEmail) {
      sendInvitationEmailApp(res.invitation).catch(() => {});
    }
  };

  const handleDeliver = async () => {
    if (!selectedInvite) return;
    setDeliverFeedback('');
    const res = await deliverToTourist({
      guide: user,
      invitationId: selectedInvite.id,
      type: itemType,
      title: itemTitle,
      message: itemMessage,
      siteId: itemSiteId,
      videoUrl: itemVideoUrl,
    });
    if (!res.ok) {
      setDeliverFeedback(res.error);
      return;
    }

    setItemTitle('');
    setItemMessage('');
    setItemVideoUrl('');
    setDeliverFeedback(`✓ Delivered to ${selectedInvite.touristName}'s portal!`);
    const dels = await getDeliverablesForInvitation(selectedInvite.id);
    setDeliverables(dels);
  };

  const handleLogout = async () => {
    await logoutAccount();
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.accent} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>🧭 Tour Guide Portal</Text>
        <Text style={styles.headerSub}>
          {user.fullName} · {user.licenseId || 'Certified Guide'}
        </Text>
        <Text style={styles.headerSpecialty}>{user.specialty}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* 1. Invite Tourist by Email */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✉️ Invite Tourist by Email</Text>
          <Text style={styles.cardSub}>
            Invite a traveler into your Ikaze portal so you can deliver trip info, permits, meeting points, and videos.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Tourist Email (e.g. visitor@gmail.com)"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={touristEmail}
            onChangeText={setTouristEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Tourist Name (optional)"
            placeholderTextColor={COLORS.textMuted}
            value={touristName}
            onChangeText={setTouristName}
          />
          <TextInput
            style={styles.input}
            placeholder="Trip Title (e.g. 3-Day Volcanoes & Lake Kivu)"
            placeholderTextColor={COLORS.textMuted}
            value={tripTitle}
            onChangeText={setTripTitle}
          />
          <TextInput
            style={[styles.input, { minHeight: 64 }]}
            placeholder="Personal welcome note..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            value={personalNote}
            onChangeText={setPersonalNote}
          />

          {inviteFeedback ? <Text style={styles.feedbackText}>{inviteFeedback}</Text> : null}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 1 }]}
              onPress={() => handleInvite(true)}
            >
              <Text style={styles.primaryBtnText}>📧 Create & Send Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => handleInvite(false)}
            >
              <Text style={styles.secondaryBtnText}>Save Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Invited Tourists */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 Invited Tourists ({invitations.length})</Text>
          {invitations.map((inv) => {
            const active = selectedInvite?.id === inv.id;
            return (
              <TouchableOpacity
                key={inv.id}
                style={[styles.inviteCard, active && styles.inviteCardActive]}
                onPress={() => selectInvitation(inv)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteTrip}>{inv.tripTitle}</Text>
                  <Text style={styles.inviteEmail}>
                    {inv.touristName} ({inv.touristEmail})
                  </Text>
                  <Text style={styles.inviteCode}>
                    Code: {inv.inviteCode} · Status: {inv.status.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.mailIconBtn}
                  onPress={() => sendInvitationEmailApp(inv).catch(() => {})}
                >
                  <Text style={{ fontSize: 16 }}>✉️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Deliver Content to Selected Tourist */}
        {selectedInvite && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              📤 Deliver Info to {selectedInvite.touristName}
            </Text>
            <Text style={styles.cardSub}>
              Trip: {selectedInvite.tripTitle} ({selectedInvite.inviteCode})
            </Text>

            <Text style={styles.label}>Content Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
              <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                {DELIVERABLE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.typeChip, itemType === t.id && styles.typeChipActive]}
                    onPress={() => setItemType(t.id)}
                  >
                    <Text style={[styles.typeChipText, itemType === t.id && styles.typeChipTextActive]}>
                      {t.emoji} {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.label}>Attach Site (for GPS Navigation)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
              <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                <TouchableOpacity
                  style={[styles.typeChip, !itemSiteId && styles.typeChipActive]}
                  onPress={() => setItemSiteId('')}
                >
                  <Text style={[styles.typeChipText, !itemSiteId && styles.typeChipTextActive]}>
                    None
                  </Text>
                </TouchableOpacity>
                {SITES.slice(0, 14).map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.typeChip, itemSiteId === s.id && styles.typeChipActive]}
                    onPress={() => setItemSiteId(s.id)}
                  >
                    <Text style={[styles.typeChipText, itemSiteId === s.id && styles.typeChipTextActive]}>
                      {s.emoji} {s.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder="Title (e.g. Gorilla Permit & Morning Pickup)"
              placeholderTextColor={COLORS.textMuted}
              value={itemTitle}
              onChangeText={setItemTitle}
            />
            <TextInput
              style={[styles.input, { minHeight: 72 }]}
              placeholder="Full details, packing list, schedule, or instructions..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              value={itemMessage}
              onChangeText={setItemMessage}
            />
            <TextInput
              style={styles.input}
              placeholder="Mediafire / Terabox Video URL (optional)"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              value={itemVideoUrl}
              onChangeText={setItemVideoUrl}
            />

            {deliverFeedback ? <Text style={styles.feedbackText}>{deliverFeedback}</Text> : null}

            <TouchableOpacity style={styles.deliverBtn} onPress={handleDeliver}>
              <Text style={styles.primaryBtnText}>🚀 Deliver to Tourist Portal</Text>
            </TouchableOpacity>

            {/* Delivered History */}
            <Text style={[styles.label, { marginTop: SPACING.lg }]}>
              Delivered Items ({deliverables.length})
            </Text>
            {deliverables.map((d) => {
              const typeMeta = DELIVERABLE_TYPES.find((t) => t.id === d.type);
              return (
                <View key={d.id} style={styles.deliveredItem}>
                  <Text style={styles.deliveredTitle}>
                    {typeMeta?.emoji || '📌'} {d.title}
                  </Text>
                  <Text style={styles.deliveredMsg}>{d.message}</Text>
                  {d.videoUrl ? (
                    <Text style={styles.deliveredMeta}>📹 Video: {d.videoUrl}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.accent,
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
  headerSub: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  headerSpecialty: { fontSize: FONTS.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  body: { padding: SPACING.md, gap: SPACING.md },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.card,
  },
  cardTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  cardSub: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, marginBottom: SPACING.md },
  label: {
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
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  btnRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  deliverBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.sm },
  secondaryBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  secondaryBtnText: { color: COLORS.textPrimary, fontWeight: FONTS.weights.semibold, fontSize: FONTS.sizes.sm },
  feedbackText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primaryDark,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inviteCardActive: {
    backgroundColor: '#EEF5FF',
    borderColor: COLORS.accent,
  },
  inviteTrip: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  inviteEmail: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  inviteCode: { fontSize: FONTS.sizes.xs, color: COLORS.accent, fontWeight: FONTS.weights.bold, marginTop: 4 },
  mailIconBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    ...SHADOW.card,
  },
  typeChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeChipText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  typeChipTextActive: { color: '#fff', fontWeight: FONTS.weights.bold },
  deliveredItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  deliveredTitle: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold, color: COLORS.textPrimary },
  deliveredMsg: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  deliveredMeta: { fontSize: FONTS.sizes.xs, color: COLORS.accent, marginTop: 4 },
});
