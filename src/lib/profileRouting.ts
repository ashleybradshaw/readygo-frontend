import type { ReadyGoState } from '../store/useReadyGoStore'

/** True when the user already granted location during onboarding/session setup. */
export const isLocationEnabled = (
  state: Pick<ReadyGoState, 'guestSession' | 'profileDraft'>,
) =>
  Boolean(
    state.guestSession.locationGranted ||
      state.profileDraft.preferences.locationSettingsOn ||
      state.profileDraft.preferences.usePhoneLocation ||
      state.profileDraft.preferences.setCurrentLocation,
  )

/** Profile creation destination — skip location screen when already enabled. */
export const getCreateProfilePath = (
  state: Pick<ReadyGoState, 'guestSession' | 'profileDraft'>,
) =>
  isLocationEnabled(state)
    ? '/user/profile-builder'
    : '/user/location-activity'
