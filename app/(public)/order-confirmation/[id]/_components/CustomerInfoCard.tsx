import { DetailCard, Field } from './DetailCard'

export const CustomerInfoCard = ({ order }: { order: any }) => (
  <DetailCard title="Customer Info" delay={0.35}>
    <div className="space-y-4">
      <Field label="Name">{order?.customerName}</Field>
      <Field label="Email" className="text-sm break-all font-normal">
        {order?.customerEmail}
      </Field>
      {order?.customerPhone && (
        <Field label="Phone" className="font-normal">
          {order.customerPhone}
        </Field>
      )}
    </div>
  </DetailCard>
)
