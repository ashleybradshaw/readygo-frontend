import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SettingsRow } from '../components/settings/SettingsRow'
import { FeedbackIssueSheet } from '../components/settings/FeedbackIssueSheet'
import { showSuccessToast } from '../components/overlays/NotificationHost'
import { useReadyGoStore } from '../store/useReadyGoStore'
import { getCreateProfilePath } from '../lib/profileRouting'

type RowConfig = {
  label: string
  onClick: () => void
  tone?: 'default' | 'data' | 'danger'
}

const SettingsSection = ({
  title,
  rows,
}: {
  title: string
  rows: RowConfig[]
}) => (
  <section>
    <p className="mt-4 mb-2 text-xs font-bold tracking-wider text-white uppercase">
      {title}
    </p>
    <div className="flex w-full flex-col">
      {rows.map((row) => (
        <SettingsRow
          key={row.label}
          label={row.label}
          tone={row.tone}
          onClick={row.onClick}
        />
      ))}
    </div>
  </section>
)

export function SettingsPage() {
  const navigate = useNavigate()
  const setSavedTab = useReadyGoStore((state) => state.setSavedTab)
  const resetProfileDraft = useReadyGoStore((state) => state.resetProfileDraft)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const handleShareApp = async () => {
    const shareData = {
      title: 'ReadyGo',
      text: 'Build smarter sessions with ReadyGo.',
      url: window.location.origin,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // user cancelled share
      return
    }
    showSuccessToast('Share ReadyGo', 'Copy this link from your browser address bar.')
  }

  const handleRateApp = () => {
    showSuccessToast('Thanks!', 'App Store review prompt would open here.')
  }

  const generalRows: RowConfig[] = [
    {
      label: 'Create new profile',
      onClick: () => {
        const state = useReadyGoStore.getState()
        const destination = getCreateProfilePath(state)
        resetProfileDraft()
        navigate(destination, { state: { returnTo: '/settings' } })
      },
    },
    {
      label: 'Saved profiles',
      onClick: () => {
        setSavedTab('profiles')
        navigate('/settings/saved-profiles')
      },
    },
    {
      label: 'Saved sessions',
      onClick: () => {
        setSavedTab('sessions')
        navigate('/settings/saved-sessions')
      },
    },
    {
      label: 'Change handle',
      onClick: () => navigate('/settings/change-handle'),
    },
    {
      label: 'Change password',
      onClick: () => navigate('/settings/change-password'),
    },
    {
      label: 'Rate the App',
      onClick: handleRateApp,
    },
    {
      label: 'Tell us about an issue',
      onClick: () => setFeedbackOpen(true),
    },
    {
      label: 'Share App',
      onClick: () => {
        void handleShareApp()
      },
    },
  ]

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#0F1918] pt-2 pb-4">
      <div className="mb-2">
        <h1 className="font-display text-2xl leading-8 font-bold tracking-[-0.02em] text-[#BACBC9] uppercase">
          Settings
        </h1>
        <p className="mt-1 font-sans text-xs font-bold tracking-[-0.01em] text-[#BACBC9]/60 uppercase">
          Version 1.0.0 (10)
        </p>
      </div>

      <SettingsSection title="General" rows={generalRows} />

      <SettingsSection
        title="Account"
        rows={[
          {
            label: 'Delete all my data',
            tone: 'data',
            onClick: () => navigate('/settings/delete-data'),
          },
          {
            label: 'Sign out',
            onClick: () => navigate('/settings/logout'),
          },
          {
            label: 'Delete my account',
            tone: 'danger',
            onClick: () => navigate('/settings/delete-account'),
          },
        ]}
      />

      <div className="mt-auto flex justify-center pt-4 pb-2">
        <button
          type="button"
          tabIndex={0}
          aria-label="Privacy Policy"
          onClick={() => navigate('/settings/privacy')}
          className="font-sans text-sm font-bold text-[#BACBC9] underline underline-offset-2"
        >
          Privacy Policy
        </button>
      </div>

      <FeedbackIssueSheet
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  )
}
