import { DetailCard, Field } from './DetailCard'

export const PaymentDetailsCard = ({ order }: { order: any }) => (
  <DetailCard title="Payment Details" delay={0.45}>
    <div className="space-y-4">
      <Field label="Method" className="capitalize">
        {order?.paymentMethod}
      </Field>
      <Field label="Status">
        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 text-xs font-bold rounded">
          {order?.status}
        </span>
      </Field>
    </div>
  </DetailCard>
)
