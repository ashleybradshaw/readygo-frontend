import type {
  ActivityType,
  ReadyGoProfile,
  SessionManifest,
  Waypoint,
  WeatherSnapshot,
} from '../store/useReadyGoStore'

const CYCLE_TITLES = [
  'Peak District Loop',
  'Rivelin Valley Spin',
  'Porter Brook Circuit',
  'Ladybower Out-and-Back',
]

const RUN_TITLES = [
  'Endcliffe Park Tempo',
  'Botanical Gardens Easy',
  'Hillsborough Ridge Run',
  'Canal Towpath Steady',
]

const TERRAINS = ['Rolling road', 'Mixed trail', 'Flat canal', 'Hilly climb']
const DIFFICULTIES = ['Easy', 'Steady', 'Hard', 'Mixed']

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length]
}

function kmToMiles(km: number) {
  return Math.round(km * 0.621371 * 10) / 10
}

function buildWaypoints(seed: number, miles: number): Waypoint[] {
  const streets = [
    'Ecclesall Road',
    'Ringinglow Road',
    'Hathersage Road',
    'Abbeydale Road',
    'Fulwood Road',
  ]
  const steps: Waypoint['kind'][] = [
    'start',
    'turn-right',
    'straight',
    'hard',
    'turn-left',
    'finish',
  ]
  const instructions = [
    'Your Location',
    'Turn right',
    'Straight on',
    'Hard climb ahead',
    'Turn left',
    'Finish',
  ]
  const distances = [0, 2.1, 0.7, 1.4, 4.3, 0.5]
  const scale = miles / distances.reduce((sum, value) => sum + value, 0.01)

  return steps.map((kind, index) => ({
    id: `wp-${seed}-${index}`,
    kind,
    instruction: instructions[index],
    street: streets[(seed + index) % streets.length],
    distanceMiles: Math.round(distances[index] * scale * 10) / 10,
  }))
}

export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  if (hours <= 0) return `${minutes} min`
  if (minutes === 0) return `${hours} hr`
  return `${hours} hr ${minutes} min`
}

export function formatSessionHours(hours: number) {
  const whole = Math.floor(hours)
  const minutes = Math.round((hours - whole) * 60)
  return `[${whole}H:${minutes.toString().padStart(2, '0')}M]`
}

export function formatWeatherLine(weather: WeatherSnapshot) {
  return `${weather.location} · ${weather.temperatureC}°C · ${weather.condition}`
}

export function buildSessionManifest(input: {
  profile: ReadyGoProfile
  weather: WeatherSnapshot
  hours: number
  rebuildBias?: number
  distanceMiles?: number
  terrain?: string
}): SessionManifest {
  const seed =
    input.profile.name.length +
    Math.round(input.hours * 10) +
    (input.rebuildBias ?? 0) * 3
  const activityType = input.profile.activityType
  const titles = activityType === 'Cycle' ? CYCLE_TITLES : RUN_TITLES
  const baseKm =
    (activityType === 'Cycle' ? 18 : 8) * input.hours + (input.rebuildBias ?? 0) * 3
  const distanceMiles =
    input.distanceMiles ??
    kmToMiles(Math.max(3, Math.round(baseKm * 10) / 10))
  const distanceKm =
    Math.round((distanceMiles / 0.621371) * 10) / 10
  const estimatedMinutes = Math.round(input.hours * 60)
  const location =
    input.profile.preferences.postcode || input.weather.location || 'Sheffield'

  return {
    id: crypto.randomUUID(),
    profileId: input.profile.id,
    title: pick(titles, seed),
    activityType,
    weatherStableHours: 2 + (seed % 3),
    estimatedMinutes,
    distanceKm,
    distanceMiles,
    difficulty: pick(DIFFICULTIES, seed + 1),
    terrain: input.terrain ?? pick(TERRAINS, seed + 2),
    startLocation: location,
    endLocation: location,
    waypoints: buildWaypoints(seed, distanceMiles),
    showMapWhileOpen: true,
  }
}

export function rebuildSession(
  session: SessionManifest,
  direction: 'shorter' | 'longer',
): SessionManifest {
  const delta = direction === 'longer' ? 1 : -1
  const distanceKm = Math.max(3, Math.round((session.distanceKm + delta * 3) * 10) / 10)
  const distanceMiles = kmToMiles(distanceKm)
  const estimatedMinutes = Math.max(
    30,
    session.estimatedMinutes + delta * 15,
  )

  return {
    ...session,
    id: crypto.randomUUID(),
    title:
      direction === 'longer'
        ? `${session.title.replace(/ \(adjusted\)$/, '')} (adjusted)`
        : session.title.replace(/ \(adjusted\)$/, ''),
    distanceKm,
    distanceMiles,
    estimatedMinutes,
    waypoints: buildWaypoints(session.title.length + delta, distanceMiles),
  }
}

export function mapsDeepLinks(session: SessionManifest) {
  const query = encodeURIComponent(
    `${session.startLocation} to ${session.endLocation}`,
  )
  return {
    apple: `https://maps.apple.com/?daddr=${query}`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  }
}

export type ActivityTypeLabel = ActivityType
