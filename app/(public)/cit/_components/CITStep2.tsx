import { TextField } from '@/components/ui/forms/TextField'

export function CITStep2({ data, errors, update }) {
  return (
    <fieldset className="space-y-4 sm:space-y-6 border-0 p-0 m-0">
      <legend className="sr-only">Contact and emergency information</legend>
      <TextField
        id="cellPhone"
        label="Cell Phone"
        type="tel"
        value={data.cellPhone}
        onChange={(v) => update('cellPhone', v)}
        required
        autoComplete="tel"
        placeholder="(781) 555-0123"
        error={errors.cellPhone}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <TextField
          id="personalEmail"
          label="Personal Email"
          type="email"
          value={data.personalEmail}
          onChange={(v) => update('personalEmail', v)}
          autoComplete="email"
          placeholder="you@example.com"
          hint="Optional"
          error={errors.personalEmail}
        />
        <TextField
          id="parentGuardianEmail"
          label="Parent / Guardian Email"
          type="email"
          value={data.parentGuardianEmail}
          onChange={(v) => update('parentGuardianEmail', v)}
          required
          placeholder="parent@example.com"
          error={errors.parentGuardianEmail}
        />
      </div>
      <TextField
        id="emergencyContact1"
        label="Emergency Contact 1"
        value={data.emergencyContact1}
        onChange={(v) => update('emergencyContact1', v)}
        required
        placeholder="Name, phone number, relationship"
        hint="Format: Name, Number, Relationship"
        error={errors.emergencyContact1}
      />
      <TextField
        id="emergencyContact2"
        label="Emergency Contact 2"
        value={data.emergencyContact2}
        onChange={(v) => update('emergencyContact2', v)}
        required
        placeholder="Name, phone number, relationship"
        hint="Format: Name, Number, Relationship"
        error={errors.emergencyContact2}
      />
    </fieldset>
  )
}
