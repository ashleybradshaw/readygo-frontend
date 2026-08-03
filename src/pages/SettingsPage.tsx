import {
  FileText,
  LayoutGrid,
  LogOut,
  Trophy,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SettingsRow } from '../components/settings/SettingsRow'
import { SignOutSheet } from '../components/settings/SignOutSheet'
import {
  showBlipConnectionError,
  showOuchSystemError,
} from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

export function SettingsPage() {
  const navigate = useNavigate()
  const setSavedTab = useReadyGoStore((state) => state.setSavedTab)
  const signOut = useReadyGoStore((state) => state.signOut)
  const [signOutOpen, setSignOutOpen] = useState(false)

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto pt-1 pb-4">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
          Settings
        </h1>
        <p className="mt-1 text-sm font-bold uppercase text-rg-text-muted">
          Version 1.0.0 (10)
        </p>
      </div>

      <section className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-rg-text-muted">
          General
        </p>
        <div className="space-y-2">
          <SettingsRow
            label="Create new profile"
            icon={<FileText size={16} />}
            onClick={() => navigate('/setup')}
          />
          <SettingsRow
            label="Saved profiles"
            icon={<LayoutGrid size={16} />}
            onClick={() => {
              setSavedTab('profiles')
              navigate('/saved')
            }}
          />
          <SettingsRow
            label="Saved sessions"
            icon={<Trophy size={16} />}
            onClick={() => {
              setSavedTab('sessions')
              navigate('/saved')
            }}
          />
          <SettingsRow
            label="Sign out"
            icon={<LogOut size={16} />}
            onClick={() => setSignOutOpen(true)}
          />
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-rg-text-muted">
          How it works
        </p>
        <div className="space-y-2">
          <SettingsRow label="Walkthrough" onClick={() => navigate('/intro')} />
          <SettingsRow
            label="Privacy Policy"
            onClick={() => navigate('/settings/privacy')}
          />
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-rg-text-muted">
          Account
        </p>
        <div className="space-y-2">
          <SettingsRow
            label="Delete all my data"
            tone="amber"
            onClick={() => navigate('/settings/delete-data')}
          />
          <SettingsRow
            label="Delete my account"
            tone="danger"
            onClick={() => navigate('/settings/delete-account')}
          />
        </div>
      </section>

      <section className="space-y-2 pb-2">
        <p className="text-xs font-bold uppercase tracking-wide text-rg-text-muted">
          Diagnostics
        </p>
        <div className="space-y-2">
          <SettingsRow
            label="Simulate BLIP! connection"
            onClick={() => showBlipConnectionError()}
          />
          <SettingsRow
            label="Simulate OUCH! system error"
            onClick={() => showOuchSystemError()}
          />
        </div>
      </section>

      <SignOutSheet
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false)
          signOut()
          navigate('/auth/login')
        }}
      />
    </div>
  )
}
