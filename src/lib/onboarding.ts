export const FALLBACK_NAMES = [
  'Ash',
  'Riley',
  'Jordan',
  'Sam',
  'Alex',
  'Casey',
  'Morgan',
  'Quinn',
]

export function pickFallbackName(exclude?: string) {
  const pool = FALLBACK_NAMES.filter((name) => name !== exclude)
  return pool[Math.floor(Math.random() * pool.length)] ?? 'Riley'
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function getPasswordChecks(password: string) {
  return {
    minLength: password.length >= 8,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumberOrSymbol: /[\d@#$%]/.test(password),
  }
}

export function passwordIsValid(password: string) {
  const checks = getPasswordChecks(password)
  return checks.minLength && checks.hasLetter && checks.hasNumberOrSymbol
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function calculateSetupProgress(prefs: {
  locationSettingsOn: boolean
  usePhoneLocation: boolean
  setCurrentLocation: boolean
  postcode: string
  preferredTimes: string[]
  fitnessLevel: string
  sessionDuration: string
  weatherChoices: string[]
  clothingSuggestions: boolean
  showGearLinks: boolean
  showSimpleMaps: boolean
  showTraffic: boolean
  loopOrSingleDestination: boolean
}) {
  const sections = [
    prefs.usePhoneLocation ||
      prefs.setCurrentLocation ||
      prefs.postcode.trim().length > 0,
    prefs.preferredTimes.length > 0,
    Boolean(prefs.fitnessLevel) && Boolean(prefs.sessionDuration),
    prefs.weatherChoices.length > 0,
    prefs.clothingSuggestions || prefs.showGearLinks,
    prefs.showSimpleMaps || prefs.showTraffic || prefs.loopOrSingleDestination,
  ]

  const completed = sections.filter(Boolean).length
  return Math.round((completed / sections.length) * 100)
}

export type ReviewSummaryPart = {
  text: string
  highlight?: boolean
}

const TIME_LABELS: Record<string, string> = {
  Morning: 'The Morning',
  Afternoon: 'The Afternoon',
  Evening: 'In The Evening',
}

const FITNESS_LABELS: Record<string, string> = {
  'Just starting out': 'Just Starting Out',
  'Been doing this a while': 'Been Doing This A While',
  'Redline pace': 'Redline Pace Mode',
  'Yellow jersey': 'Yellow Jersey Mode',
}

const DURATION_LABELS: Record<string, string> = {
  'Under an hour': 'Under An Hour',
  'Under two hours': 'Under Two Hours',
  'Under three hours': 'Under Three Hours',
  'Over three hours': 'Over Three Hours',
  'Surprise me': 'Surprise Me ( Within Five Hours)',
}

const WEATHER_LABELS: Record<string, string> = {
  Sunshine: 'Sunshine',
  Dry: 'Dry',
  Wet: 'Wet',
  'Rain/Snow': 'Rain/Snow',
  'Only sunshine': 'Only Sunshine',
  'Only when dry': "Only When It's Dry",
  'Bit of drizzle': 'A Bit Of Drizzle Is Fine',
  'Light rain': 'Light Rain – No Problem',
  'Cats and dogs': 'Cats And Dogs (Any)',
  'Cold or snow': 'Cold Weather Or Snow',
}

const mapStyleLabel = (mapStyle: string) => {
  if (mapStyle === 'Minimap' || mapStyle.toLowerCase().includes('simple')) {
    return 'Simple Maps'
  }
  if (mapStyle.toLowerCase().includes('full')) {
    return 'Full Navigation'
  }
  return mapStyle
}

export function buildReviewSummaryParts(input: {
  activityType: 'Run' | 'Cycle'
  locationMode: 'gps' | 'home' | 'postcode'
  postcode: string
  preferredTimes: string[]
  fitnessLevel: string
  weatherChoices: string[]
  clothingSuggestions: boolean
  mapStyle: string
  sessionDuration: string
}): ReviewSummaryPart[][] {
  const activityWord = input.activityType === 'Run' ? 'Runs' : 'Rides'
  const locationLabel =
    input.locationMode === 'gps'
      ? 'Current GPS'
      : input.locationMode === 'home'
        ? 'Home Location'
        : input.postcode
          ? `Postcode ${input.postcode.toUpperCase()}`
          : 'Postcode'

  const timesLabel =
    input.preferredTimes.length > 0
      ? input.preferredTimes
          .map((time) => TIME_LABELS[time] ?? `The ${time}`)
          .join(' / ')
      : 'Times That Work For You'

  const fitnessLabel =
    FITNESS_LABELS[input.fitnessLevel] ?? input.fitnessLevel

  const durationLabel =
    DURATION_LABELS[input.sessionDuration] ?? input.sessionDuration

  const weatherLabel =
    input.weatherChoices.length > 0
      ? input.weatherChoices
          .map((choice) => WEATHER_LABELS[choice] ?? choice)
          .join(', ')
      : 'Weather That Suits You'

  const navigationLabel = mapStyleLabel(input.mapStyle)

  const paragraphOne: ReviewSummaryPart[] = [
    { text: "Now I Have All That, I'll Build Your " },
    { text: activityWord, highlight: true },
    { text: ' Around Your ' },
    { text: locationLabel, highlight: true },
    { text: '.' },
  ]

  const paragraphTwo: ReviewSummaryPart[] = [
    { text: 'Most Of Your Sessions Will Likely Happen In ' },
    { text: timesLabel, highlight: true },
    { text: ', And ' },
    { text: fitnessLabel, highlight: true },
    { text: '.' },
  ]

  const paragraphThree: ReviewSummaryPart[] = [
    { text: 'Your Sessions Will Be Planned Around ' },
    { text: durationLabel, highlight: true },
    { text: ", And When It Comes To Weather, We'll Aim For " },
    { text: weatherLabel, highlight: true },
    { text: '. ' },
  ]

  if (input.clothingSuggestions) {
    paragraphThree.push({
      text: "I'll Suggest Kit Based On Conditions.",
      highlight: true,
    })
    paragraphThree.push({ text: ' ' })
  }

  paragraphThree.push(
    { text: "While You're Out, I'll Keep Navigation On " },
    { text: navigationLabel, highlight: true },
    { text: '.' },
  )

  return [paragraphOne, paragraphTwo, paragraphThree]
}

export function buildReviewSummary(input: {
  activityType: 'Run' | 'Cycle'
  locationMode: 'gps' | 'home' | 'postcode'
  postcode: string
  preferredTimes: string[]
  fitnessLevel: string
  weatherChoices: string[]
  clothingSuggestions: boolean
  mapStyle: string
  sessionDuration: string
}) {
  return buildReviewSummaryParts(input).map((parts) =>
    parts.map((part) => part.text).join(''),
  )
}
