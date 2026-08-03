import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { MobileDeviceWrapper } from './components/MobileDeviceWrapper'
import { AppShell } from './components/AppShell'
import { NotificationHost } from './components/overlays/NotificationHost'
import {
  RedirectIfAuthenticated,
  RequireAuth,
} from './components/routing/AuthGuards'
import { BasecampPage } from './pages/BasecampPage'
import { SavedPage } from './pages/SavedPage'
import { SettingsPage } from './pages/SettingsPage'
import { IntroPage } from './pages/IntroPage'
import { CreateAccountPage } from './pages/CreateAccountPage'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SetupProfilePage } from './pages/SetupProfilePage'
import { ReviewProfilePage } from './pages/ReviewProfilePage'
import { GatheringProfilePage } from './pages/GatheringProfilePage'
import { SessionGoPage } from './pages/SessionGoPage'
import { SessionActivePage } from './pages/SessionActivePage'
import { SessionSummaryPage } from './pages/SessionSummaryPage'
import { DeleteDataPage } from './pages/DeleteDataPage'
import { DeleteAccountPage } from './pages/DeleteAccountPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'

export default function App() {
  return (
    <BrowserRouter>
      <MobileDeviceWrapper>
        <NotificationHost />
        <Routes>
          <Route path="/intro" element={<IntroPage />} />
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
          <Route
            path="/auth/reset"
            element={
              <RedirectIfAuthenticated>
                <ResetPasswordPage />
              </RedirectIfAuthenticated>
            }
          />

          <Route element={<RequireAuth />}>
            <Route path="/setup" element={<SetupProfilePage />} />
            <Route path="/setup/review" element={<ReviewProfilePage />} />
            <Route path="/setup/gathering" element={<GatheringProfilePage />} />
            <Route path="/session" element={<SessionGoPage />} />
            <Route path="/session/active" element={<SessionActivePage />} />
            <Route path="/session/summary" element={<SessionSummaryPage />} />
            <Route path="/settings/delete-data" element={<DeleteDataPage />} />
            <Route
              path="/settings/delete-account"
              element={<DeleteAccountPage />}
            />
            <Route path="/settings/privacy" element={<PrivacyPolicyPage />} />

            <Route element={<AppShell />}>
              <Route index element={<BasecampPage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </MobileDeviceWrapper>
    </BrowserRouter>
  )
}
