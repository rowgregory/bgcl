const DonationTypeSelection = ({ donationType, setDonationType, setSelectedPlan }) => {
  return (
    <div className="grid sm:grid-cols-3 gap-2 mb-8">
      <button
        type="button"
        onClick={() => {
          setSelectedPlan('once_friend')
          setDonationType('once')
        }}
        className={`p-3 rounded-lg border-2 transition-all text-center ${
          donationType === 'once'
            ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
            : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
        }`}
      >
        <p
          className={`font-semibold text-sm ${donationType === 'once' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
        >
          One-Time
        </p>
        <p
          className={`text-xs ${donationType === 'once' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
        >
          Single donation
        </p>
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedPlan('monthly_supporter')
          setDonationType('monthly')
        }}
        className={`p-3 rounded-lg border-2 transition-all text-center ${
          donationType === 'monthly'
            ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
            : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
        }`}
      >
        <p
          className={`font-semibold text-sm ${donationType === 'monthly' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
        >
          Monthly
        </p>
        <p
          className={`text-xs ${donationType === 'monthly' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
        >
          Recurring support
        </p>
      </button>

      <button
        type="button"
        onClick={() => {
          setSelectedPlan('yearly-3000')
          setDonationType('yearly')
        }}
        className={`p-3 rounded-lg border-2 transition-all text-center ${
          donationType === 'yearly'
            ? 'dark:border-sky-500 dark:bg-sky-500/10 border-sky-500 bg-sky-500/10'
            : 'dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 border-neutral-200 bg-neutral-100 hover:border-neutral-300'
        }`}
      >
        <p
          className={`font-semibold text-sm ${donationType === 'yearly' ? 'dark:text-white text-neutral-900' : 'dark:text-zinc-300 text-neutral-700'}`}
        >
          Yearly
        </p>
        <p
          className={`text-xs ${donationType === 'yearly' ? 'dark:text-zinc-400 text-neutral-600' : 'dark:text-zinc-400 text-neutral-500'}`}
        >
          Annual subscription
        </p>
      </button>
    </div>
  )
}

export default DonationTypeSelection
