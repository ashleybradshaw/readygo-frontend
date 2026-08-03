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
  const activityWord = input.activityType === 'Run' ? 'runs' : 'rides'
  const locationLabel =
    input.locationMode === 'gps'
      ? 'current GPS'
      : input.locationMode === 'home'
        ? 'home location'
        : input.postcode
          ? `postcode ${input.postcode.toUpperCase()}`
          : 'postcode'

  const timesLabel = input.preferredTimes
    .map((time) => `the ${time.toLowerCase()}`)
    .join(' / ')

  const fitnessContext =
    input.fitnessLevel === 'Easy'
      ? "you'll favour easier efforts"
      : input.fitnessLevel === 'Hard'
        ? "you'll push harder sessions"
        : input.fitnessLevel === 'Mixed'
          ? "you'll mix easy and hard days"
          : "you'll keep a steady pace"

  const weatherLabel = input.weatherChoices.join(', ').toLowerCase()
  const clothingNote = input.clothingSuggestions
    ? "I'll suggest kit based on conditions."
    : "I'll skip clothing suggestions."

  return [
    `Now I have all that, I'll build your ${activityWord} around your ${locationLabel}.`,
    `Most of your sessions will likely happen in ${timesLabel}, and ${fitnessContext}.`,
    `Your sessions will be planned around ${input.sessionDuration}, and when it comes to weather, we'll aim for ${weatherLabel}. ${clothingNote} While you're out, I'll keep navigation on ${input.mapStyle.toLowerCase()}.`,
  ]
}
