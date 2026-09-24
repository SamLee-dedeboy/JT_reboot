// Checkbox slider switch repeated in JT_dashboard/src/lib/Sunburst/Sunburst.svelte
// and SunburstGrid.svelte (`bind:checked` → checked + onChange).
import './SliderToggle.css'

interface SliderToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function SliderToggle({ checked, onChange }: SliderToggleProps) {
  return (
    <label className="jtd-SliderToggle relative inline-block w-12 h-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="opacity-0 w-0 h-0"
      />
      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 transition-all duration-300 rounded-full slider">
        <span
          className={`absolute h-5 w-5 left-0.5 bottom-0.5 bg-white transition-all duration-300 rounded-full transform ${
            checked ? 'translate-x-6' : ''
          }`}
        ></span>
      </span>
    </label>
  )
}
