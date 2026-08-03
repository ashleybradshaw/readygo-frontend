export function PrivacyPolicyPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-rg-base-alt px-5 pt-10 pb-6">
      <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-rg-text">
        Privacy Policy
      </h1>
      <div className="mt-4 space-y-3 text-sm leading-5 text-rg-text-muted">
        <p>
          ReadyGo uses your location or postcode to build routes that start where
          you are. You can turn location off anytime.
        </p>
        <p>
          GOAI stores the preferences you set so sessions stay organised. You can
          delete saved routes, profiles, or your whole account in Settings.
        </p>
        <p>
          We don&apos;t sell your data. Say less, keep it useful, keep it yours.
        </p>
      </div>
    </div>
  )
}
