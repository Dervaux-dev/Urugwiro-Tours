// ============================================================
//  IKAZE — Account Auth & Tour Guide Portal Store
//  Uses AsyncStorage locally (works offline + ready for Supabase)
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const KEYS = {
  USERS: 'ikaze_users_v1',
  SESSION: 'ikaze_session_v1',
  INVITATIONS: 'ikaze_guide_invitations_v1',
  DELIVERABLES: 'ikaze_guide_deliverables_v1',
};

export const DELIVERABLE_TYPES = [
  { id: 'site_info', label: 'Site Info & Guide', emoji: '📍' },
  { id: 'itinerary', label: 'Trip Itinerary', emoji: '🗓️' },
  { id: 'video', label: 'Video (Mediafire/Terabox)', emoji: '📹' },
  { id: 'meeting_point', label: 'Meeting Point & Pickup', emoji: '🚐' },
  { id: 'permit_alert', label: 'Permit & Entry Brief', emoji: '🎫' },
];

// Pre-seeded demo accounts & sample invite so users can test immediately
const SEED_USERS = [
  {
    id: 'guide-demo-1',
    fullName: 'Jean Paul Habimana',
    email: 'guide@ikaze.rw',
    password: 'ikaze123',
    role: 'guide',
    licenseId: 'RDB-TG-2041',
    specialty: 'Volcanoes, Nyungwe & Cultural Heritage',
    createdAt: '2026-11-01T08:00:00Z',
  },
  {
    id: 'tourist-demo-1',
    fullName: 'Claire Mukamana',
    email: 'tourist@ikaze.rw',
    password: 'ikaze123',
    role: 'tourist',
    nationality: 'rwandan',
    districtId: 'musanze',
    createdAt: '2026-11-01T08:05:00Z',
  },
];

const SEED_INVITATIONS = [
  {
    id: 'inv-demo-1',
    guideId: 'guide-demo-1',
    guideName: 'Jean Paul Habimana',
    guideEmail: 'guide@ikaze.rw',
    guideLicense: 'RDB-TG-2041',
    touristEmail: 'tourist@ikaze.rw',
    touristName: 'Claire Mukamana',
    tripTitle: 'Northern Parks & Gorilla Cultural Weekend',
    inviteCode: 'IKZ-2026',
    personalNote: 'Muraho! Welcome to my Ikaze Tour Portal. Here are your briefing notes, meeting point, and video preview.',
    status: 'accepted',
    createdAt: '2026-11-20T09:00:00Z',
  },
];

const SEED_DELIVERABLES = [
  {
    id: 'del-demo-1',
    invitationId: 'inv-demo-1',
    guideEmail: 'guide@ikaze.rw',
    guideName: 'Jean Paul Habimana',
    type: 'meeting_point',
    title: 'Kinigi Park Headquarters Pickup — 06:30 AM',
    message: 'Meet at Volcanoes National Park reception in Kinigi. Bring your National ID / Passport, rain jacket, and hiking boots.',
    siteId: 'volcanoes_np',
    videoUrl: '',
    createdAt: '2026-11-20T09:10:00Z',
  },
  {
    id: 'del-demo-2',
    invitationId: 'inv-demo-1',
    guideEmail: 'guide@ikaze.rw',
    guideName: 'Jean Paul Habimana',
    type: 'itinerary',
    title: 'Day 1: Volcanoes NP + Buhanga Sacred Forest',
    message: '07:00 Gorilla/Golden Monkey briefing → 13:30 Lunch in Musanze → 15:00 Guided walk at Buhanga Eco-Park.',
    siteId: 'buhanga_ecopark',
    videoUrl: '',
    createdAt: '2026-11-20T09:15:00Z',
  },
];

async function ensureSeeded() {
  const existingUsers = await AsyncStorage.getItem(KEYS.USERS);
  if (!existingUsers) {
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
    await AsyncStorage.setItem(KEYS.INVITATIONS, JSON.stringify(SEED_INVITATIONS));
    await AsyncStorage.setItem(KEYS.DELIVERABLES, JSON.stringify(SEED_DELIVERABLES));
  }
}

async function readJson(key, fallback = []) {
  await ensureSeeded();
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

async function writeJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// ── AUTHENTICATION ──────────────────────────────────────────────

export async function getCurrentUser() {
  await ensureSeeded();
  const raw = await AsyncStorage.getItem(KEYS.SESSION);
  return raw ? JSON.parse(raw) : null;
}

export async function logoutAccount() {
  await AsyncStorage.removeItem(KEYS.SESSION);
}

export async function registerAccount({
  fullName,
  email,
  password,
  role,
  nationality = 'rwandan',
  districtId = 'gasabo',
  licenseId = '',
  specialty = '',
}) {
  const cleanEmail = email.trim().toLowerCase();
  if (!fullName.trim() || !cleanEmail || !password) {
    return { ok: false, error: 'Please fill in full name, email, and password.' };
  }

  const users = await readJson(KEYS.USERS, []);
  if (users.some((u) => u.email === cleanEmail)) {
    return { ok: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    fullName: fullName.trim(),
    email: cleanEmail,
    password,
    role, // 'tourist' | 'guide'
    nationality,
    districtId,
    licenseId: licenseId.trim() || (role === 'guide' ? `RDB-TG-${Math.floor(1000 + Math.random() * 9000)}` : ''),
    specialty: specialty.trim() || 'Rwanda National Parks & Culture',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeJson(KEYS.USERS, users);
  await writeJson(KEYS.SESSION, newUser);
  return { ok: true, user: newUser };
}

export async function loginAccount({ email, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const users = await readJson(KEYS.USERS, []);
  const user = users.find((u) => u.email === cleanEmail && u.password === password);
  if (!user) {
    return { ok: false, error: 'Invalid email or password.' };
  }
  await writeJson(KEYS.SESSION, user);
  return { ok: true, user };
}

// ── TOUR GUIDE INVITATIONS ──────────────────────────────────────

function generateInviteCode() {
  return `IKZ-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function inviteTouristByEmail({
  guide,
  touristEmail,
  touristName,
  tripTitle,
  personalNote,
}) {
  const cleanTouristEmail = touristEmail.trim().toLowerCase();
  if (!cleanTouristEmail || !cleanTouristEmail.includes('@')) {
    return { ok: false, error: 'Please enter a valid tourist email address.' };
  }
  if (!tripTitle.trim()) {
    return { ok: false, error: 'Please enter a trip title for this invitation.' };
  }

  const invitations = await readJson(KEYS.INVITATIONS, []);
  const newInvite = {
    id: `inv-${Date.now()}`,
    guideId: guide.id,
    guideName: guide.fullName,
    guideEmail: guide.email,
    guideLicense: guide.licenseId || 'RDB-CERTIFIED',
    touristEmail: cleanTouristEmail,
    touristName: touristName.trim() || cleanTouristEmail.split('@')[0],
    tripTitle: tripTitle.trim(),
    inviteCode: generateInviteCode(),
    personalNote:
      personalNote.trim() ||
      `Hello! ${guide.fullName} invited you to join their Ikaze Tour Guide Portal for your Rwanda trip.`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  invitations.unshift(newInvite);
  await writeJson(KEYS.INVITATIONS, invitations);
  return { ok: true, invitation: newInvite };
}

export function sendInvitationEmailApp(invitation) {
  const subject = encodeURIComponent(
    `Ikaze Tour Guide Invitation: ${invitation.tripTitle} (${invitation.inviteCode})`
  );
  const body = encodeURIComponent(
    `Muraho ${invitation.touristName},\n\n` +
      `${invitation.guideName} (Tour Guide · ${invitation.guideLicense}) has invited you to their Ikaze Tour Portal.\n\n` +
      `Trip: ${invitation.tripTitle}\n` +
      `Your Portal Invite Code: ${invitation.inviteCode}\n` +
      `Registered Email: ${invitation.touristEmail}\n\n` +
      `Message from your guide:\n${invitation.personalNote}\n\n` +
      `How to join:\n` +
      `1. Open the Ikaze app (or download it from our Ikaze website)\n` +
      `2. Sign in or create an account using ${invitation.touristEmail}\n` +
      `3. Open "My Guide Portal" and enter code ${invitation.inviteCode} to view all itineraries, sites, videos, and meeting points.\n\n` +
      `Murakoze — Ikaze mu Rwanda!`
  );
  return Linking.openURL(`mailto:${invitation.touristEmail}?subject=${subject}&body=${body}`);
}

export async function getGuideInvitations(guideEmail) {
  const invitations = await readJson(KEYS.INVITATIONS, []);
  return invitations.filter((inv) => inv.guideEmail === guideEmail.toLowerCase());
}

export async function acceptInvitationByCode({ code, touristEmail }) {
  const cleanCode = code.trim().toUpperCase();
  const cleanEmail = touristEmail.trim().toLowerCase();
  const invitations = await readJson(KEYS.INVITATIONS, []);
  const idx = invitations.findIndex((inv) => inv.inviteCode === cleanCode);
  if (idx === -1) {
    return { ok: false, error: `No invitation found with code "${cleanCode}".` };
  }

  invitations[idx] = {
    ...invitations[idx],
    touristEmail: invitations[idx].touristEmail || cleanEmail,
    status: 'accepted',
  };
  // Also attach to current tourist email if they claimed it via shared code
  if (invitations[idx].touristEmail !== cleanEmail) {
    invitations[idx].claimedByEmail = cleanEmail;
  }
  await writeJson(KEYS.INVITATIONS, invitations);
  return { ok: true, invitation: invitations[idx] };
}

export async function getTouristInvitations(touristEmail) {
  const cleanEmail = touristEmail.trim().toLowerCase();
  const invitations = await readJson(KEYS.INVITATIONS, []);
  return invitations.filter(
    (inv) => inv.touristEmail === cleanEmail || inv.claimedByEmail === cleanEmail
  );
}

// ── GUIDE DELIVERABLES ──────────────────────────────────────────

export async function deliverToTourist({
  guide,
  invitationId,
  type,
  title,
  message,
  siteId = '',
  videoUrl = '',
}) {
  if (!title.trim() || !message.trim()) {
    return { ok: false, error: 'Please provide both a title and details to deliver.' };
  }
  const deliverables = await readJson(KEYS.DELIVERABLES, []);
  const item = {
    id: `del-${Date.now()}`,
    invitationId,
    guideEmail: guide.email,
    guideName: guide.fullName,
    type,
    title: title.trim(),
    message: message.trim(),
    siteId: siteId || '',
    videoUrl: videoUrl.trim(),
    createdAt: new Date().toISOString(),
  };
  deliverables.unshift(item);
  await writeJson(KEYS.DELIVERABLES, deliverables);
  return { ok: true, item };
}

export async function getDeliverablesForInvitation(invitationId) {
  const deliverables = await readJson(KEYS.DELIVERABLES, []);
  return deliverables.filter((d) => d.invitationId === invitationId);
}
