const ContactInformation = ({ name, setName, email, setEmail }) => {
  return (
    <div className="space-y-4 pt-4 dark:border-zinc-700 border-t border-neutral-200">
      <div>
        <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium dark:text-zinc-300 text-neutral-700 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-sky-500 dark:placeholder-zinc-600 border-neutral-200 bg-neutral-50 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-500"
          placeholder="john@example.com"
          required
        />
      </div>
    </div>
  )
}

export default ContactInformation
