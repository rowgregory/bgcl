import { DetailCard, Field } from './DetailCard'

export const FeesCard = ({ order }: { order: any }) => {
  const hasCoveredAmount = Boolean(order?.feesCovered && order.feesCovered > 0)

  if (!order?.coverFees && !hasCoveredAmount) return null

  return (
    <DetailCard title="Fees" delay={0.55}>
      <div className="space-y-4">
        <Field label="Cover Fees">{order?.coverFees ? 'Yes' : 'No'}</Field>
        {hasCoveredAmount && (
          <Field label="Amount Covered" className="font-bold">
            ${order.feesCovered.toFixed(2)}
          </Field>
        )}
      </div>
    </DetailCard>
  )
}
