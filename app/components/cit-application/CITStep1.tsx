import { TextField } from '../ui/forms/TextField'

export function CITStep1({ data, errors, update }) {
  return (
    <fieldset className="space-y-4 sm:space-y-6 border-0 p-0 m-0">
      <legend className="sr-only">Applicant information</legend>
      <TextField
        id="name"
        label="Full Name"
        value={data.name}
        onChange={(v) => update('name', v)}
        required
        autoComplete="name"
        placeholder="Jordan Rivera"
        error={errors.name}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <TextField
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          value={data.dateOfBirth}
          onChange={(v) => update('dateOfBirth', v)}
          required
          autoComplete="bday"
          error={errors.dateOfBirth}
        />
        <TextField
          id="age"
          label="Age"
          type="number"
          value={data.age}
          onChange={(v) => update('age', v)}
          required
          placeholder="15"
          error={errors.age}
        />
      </div>
      <TextField
        id="city"
        label="City / Town"
        value={data.city}
        onChange={(v) => update('city', v)}
        required
        autoComplete="address-level2"
        placeholder="Swampscott"
        error={errors.city}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <TextField
          id="school"
          label="School"
          value={data.school}
          onChange={(v) => update('school', v)}
          required
          placeholder="Swampscott High School"
          error={errors.school}
        />
        <TextField
          id="grade"
          label="Grade (entering fall)"
          value={data.grade}
          onChange={(v) => update('grade', v)}
          required
          placeholder="10th"
          error={errors.grade}
        />
      </div>
    </fieldset>
  )
}
