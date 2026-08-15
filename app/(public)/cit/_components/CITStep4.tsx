import { TextAreaField } from '@/components/ui/forms/TextFieldArea'

export function CITStep4({ data, errors, update }) {
  return (
    <fieldset className="space-y-4 sm:space-y-6 border-0 p-0 m-0">
      <legend className="sr-only">About you</legend>
      <TextAreaField
        id="strengths"
        label="What are your strengths?"
        value={data.strengths}
        onChange={(v) => update('strengths', v)}
        required
        placeholder="Tell us what you're great at and what you'd bring to the team."
      />
      <TextAreaField
        id="hopesToLearn"
        label="What do you hope to learn this summer?"
        value={data.hopesToLearn}
        onChange={(v) => update('hopesToLearn', v)}
        required
        placeholder="Skills, experiences, or goals you'd like to work toward."
      />
      <TextAreaField
        id="hobbiesExtracurriculars"
        label="Hobbies & extracurriculars"
        value={data.hobbiesExtracurriculars}
        onChange={(v) => update('hobbiesExtracurriculars', v)}
        required
        placeholder="Sports, clubs, arts, volunteering — what do you love doing?"
      />
      {errors.strengths && (
        <p className="text-xs dark:text-red-400 text-red-600" role="alert">
          Please complete all questions above.
        </p>
      )}
    </fieldset>
  )
}
