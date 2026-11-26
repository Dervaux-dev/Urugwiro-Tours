import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW, CATEGORY_COLORS } from '../theme';

export default function SiteCard({ site, onPress, isLocal, style, distanceKm }) {
  const catStyle = CATEGORY_COLORS[site.category] || {};
  const price = isLocal ? site.localPrice : site.foreignPrice;
  const shortPrice = price?.split(' (')[0]?.split(';')[0];
  const distanceLabel =
    typeof distanceKm === 'number'
      ? `${distanceKm.toFixed(1)} km away`
      : site.distanceFromKigali?.split(' by road')[0]?.trim() || 'Kigali';

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.88}>
      <View style={[styles.emojiBox, { backgroundColor: catStyle.bg || COLORS.surface }]}>
        <Text style={styles.emoji}>{site.emoji}</Text>
      </View>

      <View style={[styles.catBadge, { backgroundColor: catStyle.bg || COLORS.surface }]}>
        <Text style={[styles.catBadgeText, { color: catStyle.text || COLORS.textSecondary }]}>
          {catStyle.icon} {site.category}
        </Text>
      </View>

      <Text style={styles.name} numberOfLines={2}>{site.name}</Text>
      <Text style={styles.tagline} numberOfLines={1}>{site.tagline}</Text>

      <View style={styles.footer}>
        <View style={styles.distanceChip}>
          <Text style={styles.distanceText} numberOfLines={1}>
            📍 {distanceLabel}
          </Text>
        </View>
        {shortPrice && (
          <Text style={[styles.price, { color: isLocal ? COLORS.primary : COLORS.accent }]} numberOfLines={1}>
            {isLocal ? '💚' : '💴'} {shortPrice}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  emojiBox: { height: 90, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 44 },
  catBadge: {
    paddingHorizontal: SPACING.sm, paddingVertical: 3, marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm, borderRadius: RADIUS.sm, alignSelf: 'flex-start',
  },
  catBadgeText: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
  name: {
    fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary, paddingHorizontal: SPACING.sm, marginTop: SPACING.xs,
  },
  tagline: {
    fontSize: FONTS.sizes.xs, color: COLORS.textMuted,
    paddingHorizontal: SPACING.sm, marginTop: 2,
  },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, marginTop: SPACING.xs,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  distanceChip: { flex: 1, marginRight: SPACING.xs },
  distanceText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  price: { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, flexShrink: 0 },
});
