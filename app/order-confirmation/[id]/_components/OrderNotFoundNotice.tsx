import Link from 'next/link'

export default function OrderNotFoundNotice({ orderId }: { orderId: string }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">we could not find that order</h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          the link may be incorrect or the order may belong to a different account. if you were charged, your receipt is
          in your email.
        </p>
        <p className="mt-4 font-mono text-xs text-neutral-500 dark:text-neutral-500">reference: {orderId}</p>
        <Link
          href="/"
          className="mt-8 inline-block px-5 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium dark:bg-neutral-100 dark:text-neutral-900"
        >
          back to home
        </Link>
      </div>
    </div>
  )
}
