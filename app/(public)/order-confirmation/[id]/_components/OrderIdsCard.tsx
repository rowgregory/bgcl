import { DetailCard, Field } from './DetailCard'

const MONO = 'font-mono text-xs break-all font-normal'

export const OrderIdsCard = ({ order }: { order: any }) => (
  <DetailCard title="Order IDs" delay={0.7}>
    <div className="space-y-3">
      <Field label="Order ID" className={MONO}>
        {order?.id}
      </Field>
      <Field label="Payment Intent" className={MONO}>
        {order?.paymentIntentId}
      </Field>
      {order?.paymentMethodId && (
        <Field label="Payment Method" className={MONO}>
          {order.paymentMethodId}
        </Field>
      )}
    </div>
  </DetailCard>
)
