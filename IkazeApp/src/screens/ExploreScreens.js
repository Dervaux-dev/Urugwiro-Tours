import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import SiteCard from '../components/SiteCard';
import { SITES } from '../data/sites';
import { getNearbySites, getSiteCoordinates } from '../data/coordinates';
import { SITE_VIDEOS } from '../data/videos';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

const CATEGORIES = ['All', ...Array.from(new Set(SITES.map((site) => site.category)))];

export function SiteDirectoryScreen({ navigation, route, isLocal }) {
  const district = route.params?.district;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState('');

  const districtSites = useMemo(
    () => (district ? SITES.filter((site) => site.districtId === district.id) : SITES),
    [district],
  );
  const showingAllFallback = Boolean(district) && districtSites.length === 0;
  const baseSites = showingAllFallback ? SITES : districtSites;

  const rankedSites = useMemo(
    () => (userLocation ? getNearbySites(userLocation.latitude, userLocation.longitude, baseSites) : baseSites),
    [baseSites, userLocation],
  );

  const distanceMap = useMemo(
    () =>
      rankedSites.reduce((acc, site) => {
        if (typeof site.distanceKm === 'number') acc[site.id] = site.distanceKm;
        return acc;
      }, {}),
    [rankedSites],
  );

  const visibleSites = useMemo(() => {
    const term = query.trim().toLowerCase();
    return rankedSites.filter((site) => {
      const matchesCategory = category === 'All' || site.category === category;
      const matchesTerm =
        !term ||
        `${site.name} ${site.tagline} ${site.category} ${site.description}`.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [rankedSites, category, query]);

  const handleNearby = async () => {
    setLocating(true);
    setLocationNote('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationNote('Location access is off. Allow it in settings to sort sites by distance.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setLocationNote('Could not get your location. Showing the standard directory.');
    } finally {
      setLocating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{district ? `${district.name} Destinations` : 'Rwanda Destinations'}</Text>
        <Text style={styles.subtitle}>
          {district ? `${district.province} · ` : ''}Search, filter and discover places to visit.
        </Text>

        {showingAllFallback && (
          <Text style={styles.notice}>
            No curated sites are listed for {district.name} yet — showing Rwanda-wide results.
          </Text>
        )}

        <TextInput
          style={styles.search}
          placeholder="Search parks, museums, lakes, memorials…"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {CATEGORIES.map((item) => {
            const active = item === category;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.nearbyButton} onPress={handleNearby} disabled={locating}>
          {locating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.nearbyButtonText}>
              {userLocation ? '📍 Update nearby order' : '📍 Sort by my location'}
            </Text>
          )}
        </TouchableOpacity>

        {locationNote ? <Text style={styles.notice}>{locationNote}</Text> : null}
        {userLocation ? (
          <Text style={styles.notice}>Sorted by straight-line distance from your current location.</Text>
        ) : null}

        <Text style={styles.count}>
          {visibleSites.length} {visibleSites.length === 1 ? 'place' : 'places'}
        </Text>

        <View style={styles.cards}>
          {visibleSites.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              isLocal={isLocal}
              distanceKm={distanceMap[site.id]}
              onPress={() => navigation.navigate('SiteDetail', { site, isLocal })}
            />
          ))}
        </View>

        {visibleSites.length === 0 && (
          <Text style={styles.empty}>No places match those filters. Try another search or category.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SiteDetailScreen({ navigation, route }) {
  const { site, isLocal } = route.params;
  const videoUrl = SITE_VIDEOS[site.id] || '';
  const price = isLocal ? site.localPrice : site.foreignPrice;
  const priceLabel = isLocal ? '💚 Rwandan / EAC rate' : '💴 Visitor rate';

  const openLink = async (url, message) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Could not open link', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.detailContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{site.emoji}</Text>
        <Text style={styles.title}>{site.name}</Text>
        <Text style={styles.category}>{site.category}</Text>
        <Text style={styles.tagline}>{site.tagline}</Text>
        <Text style={styles.description}>{site.description}</Text>

        {site.highlights?.length ? (
          <View style={styles.infoBlock}>
            <Text style={styles.blockTitle}>Highlights</Text>
            {site.highlights.map((highlight) => (
              <Text key={highlight} style={styles.bullet}>• {highlight}</Text>
            ))}
          </View>
        ) : null}

        <View style={styles.infoBlock}>
          <Text style={styles.blockTitle}>Plan your visit</Text>
          <Text style={styles.infoLine}>⏱️ Time needed: {site.duration}</Text>
          <Text style={styles.infoLine}>📆 Best time: {site.bestTime}</Text>
          <Text style={styles.infoLine}>📍 Location: {site.distanceFromKigali}</Text>
          <Text style={styles.infoLine}>{priceLabel}: {price}</Text>
          {site.priceNote ? <Text style={styles.note}>{site.priceNote}</Text> : null}
        </View>

        {videoUrl ? (
          <TouchableOpacity style={styles.button} onPress={() => openLink(videoUrl, 'The video link could not be opened.')}>
            <Text style={styles.buttonText}>▶ Watch Video Tour</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.note}>Video tour link not added yet.</Text>
        )}

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('NavigationDashboard', { site, isLocal })}
        >
          <Text style={styles.secondaryButtonText}>Open directions</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export function NavigationDashboardScreen({ navigation, route }) {
  const { site } = route.params;
  const coordinates = getSiteCoordinates(site.id);
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Directions</Text>
        <Text style={styles.subtitle}>{site.name}</Text>
        <Text style={styles.coordinates}>
          {coordinates.latitude}, {coordinates.longitude}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(mapUrl)}>
          <Text style={styles.buttonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, gap: SPACING.sm },
  back: { color: COLORS.primaryDark, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.heavy, marginTop: SPACING.sm },
  subtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  notice: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, lineHeight: 20 },
  count: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: SPACING.xs },
  empty: { color: COLORS.textMuted, fontSize: FONTS.sizes.md, textAlign: 'center', marginTop: SPACING.xl },
  search: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    marginTop: SPACING.xs,
  },
  chipRow: { gap: SPACING.sm, paddingVertical: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
  chipTextActive: { color: '#fff' },
  nearbyButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  nearbyButtonText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md, marginTop: SPACING.sm },
  detailContent: { padding: SPACING.md, gap: SPACING.sm },
  emoji: { fontSize: 64, marginTop: SPACING.xl },
  category: { color: COLORS.accent, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.bold },
  tagline: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  description: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 24, marginTop: SPACING.sm },
  infoBlock: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  blockTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  bullet: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, lineHeight: 20 },
  infoLine: { color: COLORS.textSecondary, fontSize: FONTS.sizes.sm, lineHeight: 20 },
  note: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, lineHeight: 18 },
  coordinates: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, marginTop: SPACING.md },
  button: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', marginTop: SPACING.md },
  buttonText: { color: '#fff', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  secondaryButton: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.primary },
  secondaryButtonText: { color: COLORS.primaryDark, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
});
