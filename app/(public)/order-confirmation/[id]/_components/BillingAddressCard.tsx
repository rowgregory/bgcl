import { DetailCard } from './DetailCard'

export const BillingAddressCard = ({ address }: { address: any }) => {
  if (!address) return null

  return (
    <DetailCard title="Address" delay={0.4}>
      <div className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
        <p className="font-semibold">{address.address || address.addressLine1}</p>
        {address.addressLine2 && <p>Unit {address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.zipPostalCode}
        </p>
        <p>{address.country}</p>
      </div>
    </DetailCard>
  )
}
