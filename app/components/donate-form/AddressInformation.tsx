const AddressInformation = ({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  zipCode,
  setZipCode
}) => {
  return (
    <>
      <div className="pt-4 dark:border-zinc-700 border-t border-neutral-200">
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="123 Main Street"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="Lynn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="MA"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">ZIP Code</label>
          <input
            type="number"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="01902"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
            placeholder="United States"
          />
        </div>
      </div>
    </>
  )
}

export default AddressInformation
