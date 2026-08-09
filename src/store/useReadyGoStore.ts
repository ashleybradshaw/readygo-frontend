import { create } from 'zustand'
import { buildSessionManifest } from '../lib/session'

export type ActivityType = 'Run' | 'Cycle'
export type ActiveTab = 'basecamp' | 'saved' | 'settings'
export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening'
export type FitnessLevel =
  | 'Just starting out'
  | 'Been doing this a while'
  | 'Redline pace'
  | 'Yellow jersey'
export type WeatherChoice =
  | 'Only sunshine'
  | 'Only when dry'
  | 'Bit of drizzle'
  | 'Light rain'
  | 'Cats and dogs'
  | 'Cold or snow'
export type SessionDuration =
  | 'Under an hour'
  | 'Under two hours'
  | 'Under three hours'
  | 'Over three hours'
  | 'Surprise me'
export type MapStyle = 'Minimap' | 'Full navigation'
export type LocationMode = 'gps' | 'home' | 'postcode'
export type ChartRange = 'week' | 'month' | 'year'
export type SessionStatus =
  | 'idle'
  | 'gathering'
  | 'ready'
  | 'active'
  | 'summary'
export type SavedTab = 'sessions' | 'profiles'
export type NotificationTone =
  | 'blip'
  | 'ouch'
  | 'success'
  | 'weather'
  | 'location'
export type NotificationKind = 'toast' | 'modal'

export interface ProfilePreferences {
  locationMode: LocationMode
  locationSettingsOn: boolean
  usePhoneLocation: boolean
  setCurrentLocation: boolean
  postcode: string
  preferredTimes: PreferredTime[]
  fitnessLevel: FitnessLevel
  weatherChoices: WeatherChoice[]
  clothingSuggestions: boolean
  showGearLinks: boolean
  mapStyle: MapStyle
  showSimpleMaps: boolean
  showTraffic: boolean
  loopOrSingleDestination: boolean
  preferBikePaths: boolean
  sessionDuration: SessionDuration
}

export interface ReadyGoProfile {
  id: string
  name: string
  activityType: ActivityType
  timesUsed: number
  preferences: ProfilePreferences
}

export interface SavedRoute {
  id: string
  name: string
  activityType: ActivityType
  distanceKm: number
  distanceMiles: number
  difficulty: string
  terrain: string
  durationMinutes: number
  sentiment?: number
  createdAt: string
  startLocation?: string
  endLocation?: string
}

export interface Waypoint {
  id: string
  instruction: string
  street: string
  distanceMiles: number
  kind: 'start' | 'turn-left' | 'turn-right' | 'straight' | 'hard' | 'finish'
}

export interface SessionManifest {
  id: string
  profileId: string
  title: string
  activityType: ActivityType
  weatherStableHours: number
  estimatedMinutes: number
  distanceKm: number
  distanceMiles: number
  difficulty: string
  terrain: string
  startLocation: string
  endLocation: string
  waypoints: Waypoint[]
  showMapWhileOpen: boolean
  startedAt?: string
  completedAt?: string
  sentiment?: number
}

export interface WeatherSnapshot {
  location: string
  temperatureC: number
  condition: string
}

export interface ActivityPoint {
  label: string
  miles: number
}

export interface ProfileDraft {
  activityType: ActivityType
  name: string
  preferences: ProfilePreferences
}

export interface AppNotification {
  id: string
  kind: NotificationKind
  tone: NotificationTone
  title: string
  body?: string
  subtitle?: string
  primaryLabel?: string
  secondaryLabel?: string
}

export const defaultPreferences = (): ProfilePreferences => ({
  locationMode: 'postcode',
  locationSettingsOn: true,
  usePhoneLocation: false,
  setCurrentLocation: false,
  postcode: '',
  preferredTimes: [],
  fitnessLevel: 'Just starting out',
  weatherChoices: [],
  clothingSuggestions: false,
  showGearLinks: false,
  mapStyle: 'Minimap',
  showSimpleMaps: false,
  showTraffic: false,
  loopOrSingleDestination: false,
  preferBikePaths: true,
  sessionDuration: 'Under an hour',
})

export const defaultProfileDraft = (): ProfileDraft => ({
  activityType: 'Cycle',
  name: '',
  preferences: defaultPreferences(),
})

export const defaultWeather = (): WeatherSnapshot => ({
  location: 'Sheffield',
  temperatureC: 12,
  condition: 'Light cloud',
})

export interface GuestSessionDraft {
  activitySelected: boolean
  locationGranted: boolean
  distanceMiles: number
  terrain: string
  durationHours: number
  durationLabel: string
}

export const defaultGuestSessionDraft = (): GuestSessionDraft => ({
  activitySelected: false,
  locationGranted: false,
  distanceMiles: 10,
  terrain: 'Paved',
  durationHours: 1,
  durationLabel: '1 Hour',
})

interface ReadyGoState {
  hasSeenIntro: boolean
  hasAcceptedTerms: boolean
  isAuthenticated: boolean
  isGuest: boolean
  userName: string
  userEmail: string
  authMethod: 'email' | 'apple' | 'google'
  currentProfile: ReadyGoProfile | null
  savedProfiles: ReadyGoProfile[]
  isConfigured: boolean
  hasSeenSmartWindowIntro: boolean
  weather: WeatherSnapshot
  chartRange: ChartRange
  activityByRange: Record<ChartRange, ActivityPoint[]>
  oneTimeSessionHours: number
  sessionMenuOpen: boolean
  activeSession: SessionManifest | null
  sessionStatus: SessionStatus
  savedRoutes: SavedRoute[]
  sessionHistory: SavedRoute[]
  activeTab: ActiveTab
  savedTab: SavedTab
  profileDraft: ProfileDraft
  editingProfileId: string | null
  guestSession: GuestSessionDraft
  notifications: AppNotification[]
  setHasSeenIntro: (value: boolean) => void
  setHasAcceptedTerms: (value: boolean) => void
  setAuthenticated: (value: boolean) => void
  setIsGuest: (value: boolean) => void
  enterGuestMode: () => void
  exitGuestMode: () => void
  promoteGuestToAccount: () => void
  setGuestSession: (partial: Partial<GuestSessionDraft>) => void
  resetGuestSession: () => void
  setUserName: (name: string) => void
  setUserEmail: (email: string) => void
  setAuthMethod: (method: 'email' | 'apple' | 'google') => void
  setCurrentProfile: (profile: ReadyGoProfile | null) => void
  setSavedProfiles: (profiles: ReadyGoProfile[]) => void
  setIsConfigured: (isConfigured: boolean) => void
  markSmartWindowIntroSeen: () => void
  setWeather: (weather: WeatherSnapshot) => void
  setChartRange: (range: ChartRange) => void
  setOneTimeSessionHours: (hours: number) => void
  setSessionMenuOpen: (open: boolean) => void
  setActiveSession: (session: SessionManifest | null) => void
  setSessionStatus: (status: SessionStatus) => void
  updateActiveSession: (partial: Partial<SessionManifest>) => void
  setSavedRoutes: (routes: SavedRoute[]) => void
  setActiveTab: (tab: ActiveTab) => void
  setSavedTab: (tab: SavedTab) => void
  setProfileDraft: (draft: ProfileDraft) => void
  updateProfileDraft: (partial: Partial<ProfileDraft>) => void
  updateDraftPreferences: (partial: Partial<ProfilePreferences>) => void
  completeProfileSetup: (profile: ReadyGoProfile) => void
  resetProfileDraft: () => void
  beginSessionBuild: (session: SessionManifest) => void
  markSessionReady: () => void
  startActiveSession: () => void
  finishActiveSession: () => void
  saveCompletedSession: (sentiment: number) => void
  clearSession: () => void
  bumpProfileUse: () => void
  activateProfile: (profileId: string) => void
  deleteProfile: (profileId: string) => void
  startEditProfile: (profileId: string) => void
  deleteSavedRoute: (routeId: string) => void
  loadSavedRoute: (routeId: string) => SessionManifest | null
  clearAllData: () => void
  deleteAccount: () => void
  signOut: () => void
  pushNotification: (
    notification: Omit<AppNotification, 'id'> & { id?: string },
  ) => string
  dismissNotification: (id: string) => void
  clearNotifications: () => void
}

const seedActivity = (): Record<ChartRange, ActivityPoint[]> => ({
  week: [
    { label: 'Mon', miles: 4.2 },
    { label: 'Tue', miles: 6.1 },
    { label: 'Wed', miles: 3.8 },
    { label: 'Thu', miles: 1.2 },
    { label: 'Fri', miles: 5.4 },
    { label: 'Sat', miles: 12.6 },
    { label: 'Sun', miles: 7.0 },
  ],
  month: [
    { label: 'W1', miles: 18 },
    { label: 'W2', miles: 22 },
    { label: 'W3', miles: 9 },
    { label: 'W4', miles: 27 },
  ],
  year: [
    { label: 'Jan', miles: 42 },
    { label: 'Feb', miles: 38 },
    { label: 'Mar', miles: 55 },
    { label: 'Apr', miles: 61 },
    { label: 'May', miles: 70 },
    { label: 'Jun', miles: 48 },
  ],
})

export const useReadyGoStore = create<ReadyGoState>((set, get) => ({
  hasSeenIntro: false,
  hasAcceptedTerms: false,
  isAuthenticated: false,
  isGuest: false,
  userName: '',
  userEmail: '',
  authMethod: 'email',
  currentProfile: null,
  savedProfiles: [],
  isConfigured: false,
  hasSeenSmartWindowIntro: true,
  weather: defaultWeather(),
  chartRange: 'week',
  activityByRange: seedActivity(),
  oneTimeSessionHours: 1,
  sessionMenuOpen: false,
  activeSession: null,
  sessionStatus: 'idle',
  savedRoutes: [],
  sessionHistory: [],
  activeTab: 'basecamp',
  savedTab: 'sessions',
  profileDraft: defaultProfileDraft(),
  editingProfileId: null,
  guestSession: defaultGuestSessionDraft(),
  notifications: [],
  setHasSeenIntro: (hasSeenIntro) => set({ hasSeenIntro }),
  setHasAcceptedTerms: (hasAcceptedTerms) => set({ hasAcceptedTerms }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsGuest: (isGuest) => set({ isGuest }),
  enterGuestMode: () =>
    set({
      isGuest: true,
      isAuthenticated: false,
      guestSession: defaultGuestSessionDraft(),
      profileDraft: defaultProfileDraft(),
      currentProfile: null,
      isConfigured: false,
      activeSession: null,
      sessionStatus: 'idle',
    }),
  exitGuestMode: () =>
    set({
      isGuest: false,
      guestSession: defaultGuestSessionDraft(),
      profileDraft: defaultProfileDraft(),
      currentProfile: null,
      activeSession: null,
      sessionStatus: 'idle',
    }),
  promoteGuestToAccount: () =>
    set((state) => {
      const guest = state.guestSession
      const activityType = state.profileDraft.activityType
      const hours = guest.durationHours || state.oneTimeSessionHours
      const sessionDuration: SessionDuration =
        hours < 1
          ? 'Under an hour'
          : hours < 2
            ? 'Under two hours'
            : hours < 3
              ? 'Under three hours'
              : hours <= 3
                ? 'Over three hours'
                : 'Surprise me'

      return {
        isGuest: false,
        isAuthenticated: true,
        isConfigured: false,
        oneTimeSessionHours: hours,
        profileDraft: {
          ...state.profileDraft,
          activityType,
          preferences: {
            ...state.profileDraft.preferences,
            locationMode: guest.locationGranted
              ? 'gps'
              : state.profileDraft.preferences.locationMode,
            usePhoneLocation: guest.locationGranted,
            setCurrentLocation: guest.locationGranted,
            locationSettingsOn: guest.locationGranted,
            sessionDuration,
          },
        },
        guestSession: defaultGuestSessionDraft(),
      }
    }),
  setGuestSession: (partial) =>
    set((state) => ({
      guestSession: { ...state.guestSession, ...partial },
    })),
  resetGuestSession: () => set({ guestSession: defaultGuestSessionDraft() }),
  setUserName: (userName) => set({ userName }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setAuthMethod: (authMethod) => set({ authMethod }),
  setCurrentProfile: (currentProfile) => set({ currentProfile }),
  setSavedProfiles: (savedProfiles) => set({ savedProfiles }),
  setIsConfigured: (isConfigured) => set({ isConfigured }),
  markSmartWindowIntroSeen: () => set({ hasSeenSmartWindowIntro: true }),
  setWeather: (weather) => set({ weather }),
  setChartRange: (chartRange) => set({ chartRange }),
  setOneTimeSessionHours: (oneTimeSessionHours) => set({ oneTimeSessionHours }),
  setSessionMenuOpen: (sessionMenuOpen) => set({ sessionMenuOpen }),
  setActiveSession: (activeSession) => set({ activeSession }),
  setSessionStatus: (sessionStatus) => set({ sessionStatus }),
  updateActiveSession: (partial) =>
    set((state) =>
      state.activeSession
        ? { activeSession: { ...state.activeSession, ...partial } }
        : state,
    ),
  setSavedRoutes: (savedRoutes) => set({ savedRoutes }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSavedTab: (savedTab) => set({ savedTab }),
  setProfileDraft: (profileDraft) => set({ profileDraft }),
  updateProfileDraft: (partial) =>
    set((state) => ({ profileDraft: { ...state.profileDraft, ...partial } })),
  updateDraftPreferences: (partial) =>
    set((state) => ({
      profileDraft: {
        ...state.profileDraft,
        preferences: { ...state.profileDraft.preferences, ...partial },
      },
    })),
  completeProfileSetup: (profile) =>
    set((state) => {
      const editingId = state.editingProfileId
      const nextProfiles = editingId
        ? state.savedProfiles.map((item) =>
            item.id === editingId ? profile : item,
          )
        : [profile, ...state.savedProfiles.filter((item) => item.id !== profile.id)]

      return {
        currentProfile: profile,
        savedProfiles: nextProfiles,
        isConfigured: true,
        hasSeenSmartWindowIntro: Boolean(editingId),
        profileDraft: defaultProfileDraft(),
        editingProfileId: null,
      }
    }),
  resetProfileDraft: () =>
    set({ profileDraft: defaultProfileDraft(), editingProfileId: null }),
  beginSessionBuild: (session) =>
    set({ activeSession: session, sessionStatus: 'gathering' }),
  markSessionReady: () => set({ sessionStatus: 'ready' }),
  startActiveSession: () =>
    set((state) => ({
      sessionStatus: 'active',
      activeSession: state.activeSession
        ? { ...state.activeSession, startedAt: new Date().toISOString() }
        : null,
    })),
  finishActiveSession: () =>
    set((state) => ({
      sessionStatus: 'summary',
      activeSession: state.activeSession
        ? { ...state.activeSession, completedAt: new Date().toISOString() }
        : null,
    })),
  saveCompletedSession: (sentiment) => {
    const { activeSession, currentProfile, weather } = get()
    if (!activeSession) return

    const saved: SavedRoute = {
      id: crypto.randomUUID(),
      name: activeSession.title,
      activityType: activeSession.activityType,
      distanceKm: activeSession.distanceKm,
      distanceMiles: activeSession.distanceMiles,
      difficulty: activeSession.difficulty,
      terrain: activeSession.terrain,
      durationMinutes: activeSession.estimatedMinutes,
      sentiment,
      createdAt: new Date().toISOString(),
      startLocation: activeSession.startLocation || weather.location,
      endLocation: activeSession.endLocation || weather.location,
    }

    set((state) => ({
      savedRoutes: [saved, ...state.savedRoutes],
      sessionHistory: [saved, ...state.sessionHistory],
      currentProfile: currentProfile
        ? {
            ...currentProfile,
            timesUsed: currentProfile.timesUsed + 1,
          }
        : null,
      savedProfiles: currentProfile
        ? state.savedProfiles.map((profile) =>
            profile.id === currentProfile.id
              ? { ...profile, timesUsed: profile.timesUsed + 1 }
              : profile,
          )
        : state.savedProfiles,
      activeSession: { ...activeSession, sentiment },
      sessionStatus: 'summary',
    }))
  },
  clearSession: () => set({ activeSession: null, sessionStatus: 'idle' }),
  bumpProfileUse: () =>
    set((state) =>
      state.currentProfile
        ? {
            currentProfile: {
              ...state.currentProfile,
              timesUsed: state.currentProfile.timesUsed + 1,
            },
          }
        : state,
    ),
  activateProfile: (profileId) => {
    const profile = get().savedProfiles.find((item) => item.id === profileId)
    if (!profile) return
    set({ currentProfile: profile, isConfigured: true })
  },
  deleteProfile: (profileId) =>
    set((state) => {
      const remaining = state.savedProfiles.filter((item) => item.id !== profileId)
      const wasCurrent = state.currentProfile?.id === profileId
      return {
        savedProfiles: remaining,
        currentProfile: wasCurrent ? remaining[0] ?? null : state.currentProfile,
        isConfigured: remaining.length > 0,
      }
    }),
  startEditProfile: (profileId) => {
    const profile = get().savedProfiles.find((item) => item.id === profileId)
    if (!profile) return
    set({
      editingProfileId: profile.id,
      profileDraft: {
        name: profile.name,
        activityType: profile.activityType,
        preferences: { ...profile.preferences },
      },
    })
  },
  deleteSavedRoute: (routeId) =>
    set((state) => ({
      savedRoutes: state.savedRoutes.filter((route) => route.id !== routeId),
      sessionHistory: state.sessionHistory.filter((route) => route.id !== routeId),
    })),
  loadSavedRoute: (routeId) => {
    const state = get()
    const route = state.savedRoutes.find((item) => item.id === routeId)
    const profile = state.currentProfile
    if (!route || !profile) return null

    const hours = Math.max(1, route.durationMinutes / 60)
    const session = buildSessionManifest({
      profile,
      weather: state.weather,
      hours,
    })
    const loaded: SessionManifest = {
      ...session,
      title: route.name,
      activityType: route.activityType,
      distanceKm: route.distanceKm,
      distanceMiles: route.distanceMiles,
      difficulty: route.difficulty,
      terrain: route.terrain,
      estimatedMinutes: route.durationMinutes,
      startLocation: route.startLocation || state.weather.location,
      endLocation: route.endLocation || state.weather.location,
    }
    set({ activeSession: loaded, sessionStatus: 'ready' })
    return loaded
  },
  clearAllData: () =>
    set({
      savedRoutes: [],
      sessionHistory: [],
      savedProfiles: [],
      currentProfile: null,
      isConfigured: false,
      hasSeenSmartWindowIntro: true,
      activeSession: null,
      sessionStatus: 'idle',
      profileDraft: defaultProfileDraft(),
      editingProfileId: null,
    }),
  deleteAccount: () =>
    set({
      hasSeenIntro: false,
      hasAcceptedTerms: false,
      isAuthenticated: false,
      isGuest: false,
      guestSession: defaultGuestSessionDraft(),
      userName: '',
      userEmail: '',
      authMethod: 'email' as const,
      currentProfile: null,
      savedProfiles: [],
      isConfigured: false,
      hasSeenSmartWindowIntro: true,
      savedRoutes: [],
      sessionHistory: [],
      activeSession: null,
      sessionStatus: 'idle',
      profileDraft: defaultProfileDraft(),
      editingProfileId: null,
      notifications: [],
      sessionMenuOpen: false,
      oneTimeSessionHours: 1,
      weather: defaultWeather(),
    }),
  signOut: () =>
    set({
      isAuthenticated: false,
      isGuest: false,
      guestSession: defaultGuestSessionDraft(),
      activeSession: null,
      sessionStatus: 'idle',
      sessionMenuOpen: false,
      notifications: [],
    }),
  pushNotification: (notification) => {
    const id = notification.id ?? crypto.randomUUID()
    set((state) => ({
      notifications: [
        ...state.notifications.filter((item) => item.id !== id),
        { ...notification, id },
      ],
    }))
    return id
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}))
