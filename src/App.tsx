import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MobileDeviceWrapper } from './components/MobileDeviceWrapper'
import { AppShell } from './components/AppShell'
import { NotificationHost } from './components/overlays/NotificationHost'
import {
  RedirectIfAuthenticated,
  RequireAccount,
  RequireAuth,
} from './components/routing/AuthGuards'
import { BasecampPage } from './pages/BasecampPage'
import { SavedPage } from './pages/SavedPage'
import { SettingsPage } from './pages/SettingsPage'
import { IntroPage } from './pages/IntroPage'
import { OpenScreenPage } from './pages/OpenScreenPage'
import { WelcomeEntryPage } from './pages/WelcomeEntryPage'
import { GuestActivityPage } from './pages/GuestActivityPage'
import { GuestSessionPage } from './pages/GuestSessionPage'
import { GuestSessionReadyPage } from './pages/GuestSessionReadyPage'
import { GuestMapPreviewPage } from './pages/GuestMapPreviewPage'
import { GuestLoadingPage } from './pages/GuestLoadingPage'
import { GuestActivePage } from './pages/GuestActivePage'
import { GuestSummaryPage } from './pages/GuestSummaryPage'
import { GuestBasecampPage } from './pages/GuestBasecampPage'
import { TermsOfServicePage } from './pages/TermsOfServicePage'
import { CreateAccountPage } from './pages/CreateAccountPage'
import { LoginPage } from './pages/LoginPage'
import { VerificationCodePage } from './pages/VerificationCodePage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { NewPasswordPage } from './pages/NewPasswordPage'
import { ResetSuccessPage } from './pages/ResetSuccessPage'
import { HandleClaimPage } from './pages/HandleClaimPage'
import { AccountCreatedPage } from './pages/AccountCreatedPage'
import { UserBasecampSetupPage } from './pages/UserBasecampSetupPage'
import { UserLoadingPage } from './pages/UserLoadingPage'
import { UserSessionTunerPage } from './pages/UserSessionTunerPage'
import { UserProfileBuilderPage } from './pages/UserProfileBuilderPage'
import { GatheringProfilePage } from './pages/GatheringProfilePage'
import { SessionGoPage } from './pages/SessionGoPage'
import { GatheringSessionPage } from './pages/GatheringSessionPage'
import { LoadingSessionPage } from './pages/LoadingSessionPage'
import { SessionActivePage } from './pages/SessionActivePage'
import { SessionSummaryPage } from './pages/SessionSummaryPage'
import { DeleteDataPage } from './pages/DeleteDataPage'
import { DeleteAccountPage } from './pages/DeleteAccountPage'
import { ChangeHandlePage } from './pages/ChangeHandlePage'
import { LogoutPage } from './pages/LogoutPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'

export default function App() {
  return (
    <BrowserRouter>
      <MobileDeviceWrapper>
        <NotificationHost />
        <Routes>
          <Route path="/" element={<OpenScreenPage />} />
          <Route path="/startup" element={<Navigate to="/" replace />} />
          <Route path="/welcome" element={<WelcomeEntryPage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/guest/activity" element={<GuestActivityPage />} />
          <Route path="/guest/session" element={<GuestSessionPage />} />

          <Route path="/auth/terms" element={<TermsOfServicePage />} />
          <Route
            path="/auth/create"
            element={
              <RedirectIfAuthenticated>
                <CreateAccountPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/auth/login"
            element={
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            }
          />
          <Route path="/auth/verify" element={<VerificationCodePage />} />
          <Route path="/auth/handle-claim" element={<HandleClaimPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/auth/reset"
            element={<Navigate to="/auth/reset-password" replace />}
          />
          <Route path="/auth/new-password" element={<NewPasswordPage />} />
          <Route
            path="/auth/reset/new"
            element={<Navigate to="/auth/new-password" replace />}
          />
          <Route path="/auth/reset-success" element={<ResetSuccessPage />} />
          <Route
            path="/setup/account-created"
            element={<AccountCreatedPage />}
          />

          <Route element={<RequireAuth />}>
            <Route
              path="/user/location-activity"
              element={<UserProfileBuilderPage />}
            />
            <Route
              path="/user/basecamp-setup"
              element={<UserBasecampSetupPage />}
            />
            <Route path="/user/loading" element={<UserLoadingPage />} />
            <Route
              path="/user/session-tuner"
              element={<UserSessionTunerPage />}
            />
            <Route path="/user/session-ready" element={<SessionGoPage />} />
            <Route
              path="/user/session-active"
              element={<SessionActivePage />}
            />
            <Route path="/user/summary" element={<SessionSummaryPage />} />
            <Route
              path="/setup"
              element={<Navigate to="/user/location-activity" replace />}
            />
            <Route
              path="/setup/review"
              element={<Navigate to="/user/basecamp" replace />}
            />
            <Route path="/setup/gathering" element={<GatheringProfilePage />} />

            <Route
              path="/guest/session-ready"
              element={<GuestSessionReadyPage />}
            />
            <Route
              path="/guest/map-preview"
              element={<GuestMapPreviewPage />}
            />
            <Route path="/guest/loading" element={<GuestLoadingPage />} />
            <Route path="/guest/active" element={<GuestActivePage />} />
            <Route path="/guest/summary" element={<GuestSummaryPage />} />
            <Route path="/guest/basecamp" element={<GuestBasecampPage />} />

            <Route
              path="/session"
              element={<Navigate to="/user/session-ready" replace />}
            />
            <Route
              path="/session/gathering"
              element={<GatheringSessionPage />}
            />
            <Route path="/session/go" element={<SessionGoPage />} />
            <Route path="/session/loading" element={<LoadingSessionPage />} />
            <Route path="/session/active" element={<SessionActivePage />} />
            <Route path="/session/summary" element={<SessionSummaryPage />} />

            <Route element={<RequireAccount />}>
              <Route path="/settings/delete-data" element={<DeleteDataPage />} />
              <Route
                path="/settings/delete-account"
                element={<DeleteAccountPage />}
              />
              <Route
                path="/settings/change-handle"
                element={<ChangeHandlePage />}
              />
              <Route path="/settings/logout" element={<LogoutPage />} />
              <Route
                path="/settings/saved-profiles"
                element={<SavedPage initialTab="profiles" />}
              />
              <Route
                path="/settings/saved-sessions"
                element={<SavedPage initialTab="sessions" />}
              />
              <Route path="/settings/privacy" element={<PrivacyPolicyPage />} />
              <Route
                path="/saved"
                element={<Navigate to="/settings/saved-sessions" replace />}
              />

              <Route element={<AppShell />}>
                <Route path="user/basecamp" element={<BasecampPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileDeviceWrapper>
    </BrowserRouter>
  )
}
