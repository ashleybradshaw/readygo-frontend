type BinaryToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

/** Binary selection — no OFF state (Run/Cycle, Loop/Point-to-Point). */
export const BinaryToggle = ({
  checked,
  onChange,
  label,
}: BinaryToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onChange(!checked)
      }
    }}
    className="relative flex h-[18px] w-[60px] shrink-0 cursor-pointer items-center rounded-full border-2 border-[#2D3739] bg-[#0F191B] p-0"
  >
    <span
      aria-hidden="true"
      className={`absolute top-1/2 left-0 h-6 w-6 rounded-full shadow-md transition-transform duration-200 ease-in-out ${
        checked
          ? 'translate-x-[36px] -translate-y-1/2 bg-[#7CFF00]'
          : 'translate-x-0 -translate-y-1/2 bg-[#BACBC9]'
      }`}
    />
  </button>
)

type BooleanToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

/** Boolean ON/OFF feature switch. */
export const BooleanToggle = ({
  checked,
  onChange,
  label,
}: BooleanToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    tabIndex={0}
    onClick={() => onChange(!checked)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onChange(!checked)
      }
    }}
    className={`relative flex h-[18px] w-[60px] shrink-0 cursor-pointer items-center rounded-full border-2 bg-[#0F191B] p-0 ${
      checked ? 'border-[#7CFF00]' : 'border-[#2D3739]'
    }`}
  >
    <span
      aria-hidden="true"
      className={`absolute top-1/2 left-0 h-6 w-6 rounded-full shadow-md transition-transform duration-200 ease-in-out ${
        checked
          ? 'translate-x-[36px] -translate-y-1/2 bg-[#7CFF00]'
          : 'translate-x-0 -translate-y-1/2 bg-[#BACBC9]'
      }`}
    />
  </button>
)
