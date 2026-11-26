// ============================================================
//  GPS Coordinates for All 30 Rwandan Districts & Tourist Sites
// ============================================================

export const DISTRICT_COORDINATES = {
  gasabo:     { latitude: -1.9100, longitude: 30.1044 },
  kicukiro:   { latitude: -1.9706, longitude: 30.1044 },
  nyarugenge: { latitude: -1.9536, longitude: 30.0606 },
  burera:     { latitude: -1.4547, longitude: 29.8300 },
  gakenke:    { latitude: -1.6939, longitude: 29.7867 },
  gicumbi:    { latitude: -1.5767, longitude: 30.0672 },
  musanze:    { latitude: -1.4998, longitude: 29.6350 },
  rulindo:    { latitude: -1.7372, longitude: 29.9972 },
  gisagara:   { latitude: -2.6114, longitude: 29.8378 },
  huye:       { latitude: -2.5967, longitude: 29.7394 },
  kamonyi:    { latitude: -2.0231, longitude: 29.9036 },
  muhanga:    { latitude: -2.0853, longitude: 29.7567 },
  nyamagabe:  { latitude: -2.4731, longitude: 29.5664 },
  nyanza:     { latitude: -2.3519, longitude: 29.7508 },
  nyaruguru:  { latitude: -2.7044, longitude: 29.5289 },
  ruhango:    { latitude: -2.2333, longitude: 29.7833 },
  bugesera:   { latitude: -2.2036, longitude: 30.1450 },
  gatsibo:    { latitude: -1.5889, longitude: 30.4536 },
  kayonza:    { latitude: -1.8944, longitude: 30.5178 },
  kirehe:     { latitude: -2.2667, longitude: 30.6500 },
  ngoma:      { latitude: -2.1833, longitude: 30.4833 },
  nyagatare:  { latitude: -1.2981, longitude: 30.3267 },
  rwamagana:  { latitude: -1.9486, longitude: 30.4347 },
  karongi:    { latitude: -2.0600, longitude: 29.3489 },
  ngororero:  { latitude: -1.8686, longitude: 29.6228 },
  nyabihu:    { latitude: -1.6514, longitude: 29.5067 },
  nyamasheke: { latitude: -2.3333, longitude: 29.1333 },
  rubavu:     { latitude: -1.6819, longitude: 29.2572 },
  rusizi:     { latitude: -2.4847, longitude: 28.9075 },
  rutsiro:    { latitude: -1.9333, longitude: 29.3333 },
};

export const SITE_COORDINATES = {
  volcanoes_np:             { latitude: -1.4833, longitude: 29.5333 },
  akagera_np:               { latitude: -1.8780, longitude: 30.7130 },
  nyungwe_np:               { latitude: -2.4867, longitude: 29.2058 },
  gishwati_np:              { latitude: -1.8167, longitude: 29.3667 },
  lake_kivu_rubavu:         { latitude: -1.7031, longitude: 29.2564 },
  lake_kivu_karongi:        { latitude: -2.0603, longitude: 29.3478 },
  twin_lakes:               { latitude: -1.4667, longitude: 29.7500 },
  lake_muhazi:              { latitude: -1.8667, longitude: 30.3667 },
  isumo_waterfall:          { latitude: -2.4639, longitude: 29.1528 },
  ndaba_falls:              { latitude: -2.0558, longitude: 29.4619 },
  rusumo_falls:             { latitude: -2.3822, longitude: 30.7825 },
  ethnographic_museum:      { latitude: -2.5897, longitude: 29.7444 },
  kings_palace_museum:      { latitude: -2.3564, longitude: 29.7436 },
  rwanda_art_museum:        { latitude: -1.9708, longitude: 30.1558 },
  kandt_house_museum:       { latitude: -1.9469, longitude: 30.0569 },
  campaign_genocide_museum: { latitude: -1.9519, longitude: 30.0928 },
  liberation_museum:        { latitude: -1.5222, longitude: 30.0500 },
  museum_environment:       { latitude: -2.0614, longitude: 29.3492 },
  kigali_memorial:          { latitude: -1.9306, longitude: 30.0606 },
  nyamata_memorial:         { latitude: -2.1489, longitude: 30.0942 },
  murambi_memorial:         { latitude: -2.4553, longitude: 29.5681 },
  bisesero_memorial:        { latitude: -2.1922, longitude: 29.3389 },
  ntarama_memorial:         { latitude: -2.1117, longitude: 30.0497 },
  garden_of_memory:         { latitude: -1.9814, longitude: 30.0944 },
  buhanga_ecopark:          { latitude: -1.5319, longitude: 29.6075 },
  ibyiwacu_cultural:        { latitude: -1.4589, longitude: 29.5758 },
  red_rocks_arts:           { latitude: -1.4711, longitude: 29.5914 },
  kibeho_shrine:            { latitude: -2.6514, longitude: 29.5533 },
  nyundo_cathedral:         { latitude: -1.7014, longitude: 29.3256 },
  congo_nile_trail:         { latitude: -1.7031, longitude: 29.2564 },
  hot_air_balloon:          { latitude: -1.8780, longitude: 30.7130 },
  musanze_caves:            { latitude: -1.5008, longitude: 29.6122 },
  kimironko_market:         { latitude: -1.9478, longitude: 30.1258 },
  fazenda_sengha:           { latitude: -1.9700, longitude: 30.0294 },
  inema_arts:               { latitude: -1.9447, longitude: 30.0956 },
  kigali_centenary_park:    { latitude: -1.9547, longitude: 30.0686 },
};

export function getSiteCoordinates(siteId) {
  return SITE_COORDINATES[siteId] || { latitude: -1.9441, longitude: 30.0619 };
}

export function getDistrictCoordinates(districtId) {
  return DISTRICT_COORDINATES[districtId] || { latitude: -1.9441, longitude: 30.0619 };
}

function haversineDistanceKm(from, to) {
  const earthRadiusKm = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

export function getNearbySites(latitude, longitude, sites, limit = sites.length) {
  const origin = { latitude, longitude };
  return sites
    .map((site) => ({ ...site, distanceKm: haversineDistanceKm(origin, getSiteCoordinates(site.id)) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export const DEMO_LOCATIONS = [
  { label: 'Kigali City Center', districtId: 'nyarugenge', latitude: -1.9536, longitude: 30.0606 },
  { label: 'Musanze Town', districtId: 'musanze', latitude: -1.4998, longitude: 29.6350 },
  { label: 'Huye (Butare)', districtId: 'huye', latitude: -2.5967, longitude: 29.7394 },
  { label: 'Rubavu (Lake Kivu)', districtId: 'rubavu', latitude: -1.6819, longitude: 29.2572 },
  { label: 'Kayonza (East)', districtId: 'kayonza', latitude: -1.8944, longitude: 30.5178 },
];
