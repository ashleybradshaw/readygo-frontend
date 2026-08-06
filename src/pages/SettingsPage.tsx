import {
  FileText,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Shield,
  Trophy,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { SettingsRow } from '../components/settings/SettingsRow'
import { SettingsCloseButton } from '../components/settings/SettingsCloseButton'
import { SignOutSheet } from '../components/settings/SignOutSheet'
import {
  showBlipConnectionError,
  showBlipLocationFailed,
  showBlipWeatherFallback,
  showOuchSystemError,
} from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'

const ICON = { size: 24, color: '#182629', strokeWidth: 1.75 } as const

type RowConfig = {
  label: string
  onClick: () => void
  icon?: ReactNode
  tone?: 'default' | 'data' | 'danger'
}

const SettingsSection = ({
  title,
  rows,
}: {
  title: string
  rows: RowConfig[]
}) => (
  <section className="mb-6">
    <p className="mb-2 font-sans text-sm font-bold text-[#0F1918]">{title}</p>
    <div className="flex flex-col gap-0 overflow-hidden rounded-[10px]">
      {rows.map((row, index) => (
        <SettingsRow
          key={row.label}
          label={row.label}
          icon={row.icon}
          tone={row.tone}
          index={index}
          totalLength={rows.length}
          onClick={row.onClick}
        />
      ))}
    </div>
  </section>
)

export function SettingsPage() {
  const navigate = useNavigate()
  const setSavedTab = useReadyGoStore((state) => state.setSavedTab)
  const signOut = useReadyGoStore((state) => state.signOut)
  const [signOutOpen, setSignOutOpen] = useState(false)

  return (
    <div className="flex h-full flex-col overflow-y-auto pt-2 pb-4">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase leading-8 tracking-[-0.02em] text-[#0F1918]">
            Settings
          </h1>
          <p className="mt-1 font-sans text-sm font-bold uppercase tracking-[-0.01em] text-[#0F1918]">
            Version 1.0.0 (10)
          </p>
        </div>
        <SettingsCloseButton onClick={() => navigate('/')} />
      </div>

      <SettingsSection
        title="General"
        rows={[
          {
            label: 'Create New Profile',
            icon: <FileText {...ICON} />,
            onClick: () => navigate('/setup'),
          },
          {
            label: 'Saved Profiles',
            icon: <LayoutGrid {...ICON} />,
            onClick: () => {
              setSavedTab('profiles')
              navigate('/saved')
            },
          },
          {
            label: 'Saved Sessions',
            icon: <Trophy {...ICON} />,
            onClick: () => {
              setSavedTab('sessions')
              navigate('/saved')
            },
          },
          {
            label: 'Sign Out',
            icon: <LogOut {...ICON} />,
            onClick: () => setSignOutOpen(true),
          },
        ]}
      />

      <SettingsSection
        title="How it works"
        rows={[
          {
            label: 'Walkthrough',
            icon: <HelpCircle {...ICON} />,
            onClick: () => navigate('/intro'),
          },
          {
            label: 'Privacy Policy',
            icon: <Shield {...ICON} />,
            onClick: () => navigate('/settings/privacy'),
          },
        ]}
      />

      <SettingsSection
        title="Account"
        rows={[
          {
            label: 'Delete All My Data',
            tone: 'data',
            onClick: () => navigate('/settings/delete-data'),
          },
          {
            label: 'Delete My Account',
            tone: 'danger',
            onClick: () => navigate('/settings/delete-account'),
          },
        ]}
      />

      <SettingsSection
        title="Diagnostics"
        rows={[
          {
            label: 'Simulate BLIP! connection',
            onClick: () => showBlipConnectionError(),
          },
          {
            label: 'Simulate BLIP! weather',
            onClick: () => showBlipWeatherFallback(),
          },
          {
            label: 'Simulate BLIP! location',
            onClick: () => showBlipLocationFailed(),
          },
          {
            label: 'Simulate OUCH! system error',
            onClick: () => showOuchSystemError(),
          },
        ]}
      />

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
