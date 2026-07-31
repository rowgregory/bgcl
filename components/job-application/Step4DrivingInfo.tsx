import { AnimatePresence, motion } from 'framer-motion'

export function Step4DrivingInfo({ formData, setFormData, errors }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold dark:text-white text-neutral-900 mb-2">Driving Info</h3>
        <p className="dark:text-neutral-400 text-neutral-600 text-sm">
          This information helps us ensure safe transportation for the youth we serve.
        </p>
      </div>

      {/* Valid Driver's License */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold dark:text-white text-neutral-900">
          Do you have a valid driver's license?{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </legend>
        <div className="space-y-3 mt-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="hasValidDriverLicense"
              checked={formData.hasValidDriverLicense === false}
              onChange={() => setFormData({ ...formData, hasValidDriverLicense: false })}
              aria-describedby={errors.hasValidDriverLicense ? 'license-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="hasValidDriverLicense"
              checked={formData.hasValidDriverLicense === true}
              onChange={() => setFormData({ ...formData, hasValidDriverLicense: true })}
              aria-describedby={errors.hasValidDriverLicense ? 'license-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </fieldset>

      {/* Conditional Fields Based on License Status */}
      <AnimatePresence mode="wait">
        {formData.hasValidDriverLicense ? (
          <motion.div
            key="license-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-6"
            role="group"
            aria-label="License details"
          >
            <div className="flex flex-col w-full">
              <label
                htmlFor="license-number"
                className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
              >
                License Number{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="license-number"
                type="text"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                aria-required="true"
                aria-invalid={!!errors.licenseNumber}
                aria-describedby={errors.licenseNumber ? 'license-number-error' : undefined}
                autoComplete="off"
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
                placeholder="12345678"
              />
              {errors.licenseNumber && (
                <p id="license-number-error" role="alert" className="text-red-500 text-sm mt-1">
                  {errors.licenseNumber}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="license-expiration"
                className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
              >
                License Expiration{' '}
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id="license-expiration"
                type="date"
                value={formData.licenseExpiration || ''}
                onChange={(e) => setFormData({ ...formData, licenseExpiration: e.target.value })}
                aria-required="true"
                aria-invalid={!!errors.licenseExpiration}
                aria-describedby={errors.licenseExpiration ? 'license-expiration-error' : undefined}
                className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              />
              {errors.licenseExpiration && (
                <p id="license-expiration-error" role="alert" className="text-red-500 text-sm mt-1">
                  {errors.licenseExpiration}
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-license"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <label
              htmlFor="no-license-reason"
              className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
            >
              Reason for not having a license{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="no-license-reason"
              type="text"
              value={formData.noLicenseReason || ''}
              onChange={(e) => setFormData({ ...formData, noLicenseReason: e.target.value })}
              aria-required="true"
              aria-invalid={!!errors.noLicenseReason}
              aria-describedby={errors.noLicenseReason ? 'no-license-reason-error' : undefined}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
              placeholder="Please explain..."
              maxLength={500}
            />
            <p
              className={`text-xs mt-1 text-right ${
                (formData.noLicenseReason?.length || 0) >= 400
                  ? 'text-red-500'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {500 - (formData.noLicenseReason?.length || 0)} characters remaining
            </p>
            {errors.noLicenseReason && (
              <p id="no-license-reason-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.noLicenseReason}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* License Suspension */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold dark:text-white text-neutral-900">
          Has your license ever been suspended or revoked?{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </legend>
        <div className="space-y-3 mt-2">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="licenseSuspended"
              checked={formData.licenseSuspended === false}
              onChange={() => setFormData({ ...formData, licenseSuspended: false })}
              aria-describedby={errors.licenseSuspended ? 'suspension-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              No
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="licenseSuspended"
              checked={formData.licenseSuspended === true}
              onChange={() => setFormData({ ...formData, licenseSuspended: true })}
              aria-describedby={errors.licenseSuspended ? 'suspension-group-error' : undefined}
              className="w-4 h-4 dark:border-neutral-600 dark:bg-neutral-800 dark:text-sky-500 border-neutral-300 bg-white text-sky-600 cursor-pointer focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            />
            <span className="dark:text-white text-neutral-900 group-hover:dark:text-neutral-100 group-hover:text-neutral-800 transition-colors">
              Yes
            </span>
          </label>
        </div>
      </fieldset>

      {/* Suspension Explanation */}
      <AnimatePresence>
        {formData.licenseSuspended && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
            role="group"
            aria-label="Suspension details"
          >
            <label
              htmlFor="suspension-explanation"
              className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
            >
              Please explain the suspension or revocation.{' '}
              <span aria-hidden="true" className="text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <textarea
              id="suspension-explanation"
              value={formData.suspensionExplanation || ''}
              onChange={(e) => setFormData({ ...formData, suspensionExplanation: e.target.value })}
              aria-required="true"
              aria-invalid={!!errors.suspensionExplanation}
              aria-describedby={errors.suspensionExplanation ? 'suspension-explanation-error' : undefined}
              className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-24 transition-colors resize-none"
              placeholder="Please explain the circumstances..."
              maxLength={1000}
            />
            <p
              className={`text-xs mt-1 text-right ${
                (formData.suspensionExplanation?.length || 0) >= 900
                  ? 'text-red-500'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {1000 - (formData.suspensionExplanation?.length || 0)} characters remaining
            </p>
            {errors.suspensionExplanation && (
              <p id="suspension-explanation-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.suspensionExplanation}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traffic Violations */}
      <div>
        <label
          htmlFor="traffic-violations"
          className="block text-sm font-semibold dark:text-white text-neutral-900 mb-2"
        >
          Please list all moving traffic violations in the last 5 years{' '}
          <span className="font-normal dark:text-neutral-400 text-neutral-600">
            (Offense, Date, Location, Comments)
          </span>{' '}
          <span aria-hidden="true" className="text-red-500">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id="traffic-violations"
          value={formData.trafficViolations || ''}
          onChange={(e) => setFormData({ ...formData, trafficViolations: e.target.value })}
          aria-required="true"
          aria-invalid={!!errors.trafficViolations}
          aria-describedby={errors.trafficViolations ? 'traffic-violations-error' : 'traffic-violations-hint'}
          className="w-full px-4 py-2.5 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white bg-white border-neutral-300 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-32 transition-colors resize-none"
          placeholder="Enter offense details, dates, and locations. Enter 'None' if not applicable."
          maxLength={1000}
        />
        <p
          className={`text-xs mt-1 text-right ${
            (formData.trafficViolations?.length || 0) >= 900 ? 'text-red-500' : 'text-neutral-400 dark:text-neutral-500'
          }`}
        >
          {1000 - (formData.trafficViolations?.length || 0)} characters remaining
        </p>
        <p id="traffic-violations-hint" className="text-xs dark:text-neutral-500 text-neutral-500 mt-1">
          Include offense, date, location, and any comments. Enter "None" if not applicable.
        </p>
        {errors.trafficViolations && (
          <p id="traffic-violations-error" role="alert" className="text-red-500 text-sm mt-1">
            {errors.trafficViolations}
          </p>
        )}
      </div>
    </div>
  )
}
