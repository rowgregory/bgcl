import { Calendar } from 'lucide-react'
import { formatEnumLabel } from '@/lib/utils/formatEnumLabel'
import { DetailCard, Field } from './DetailCard'
import { formatShortDate } from '../_formatters'

interface DonationInfoCardProps {
  order: any
  isRecurring: boolean
}

export const DonationInfoCard = ({ order, isRecurring }: DonationInfoCardProps) => (
  <DetailCard title="Donation Info" delay={0.5}>
    <div className="space-y-4">
      <Field label="Type">{formatEnumLabel(order?.type)}</Field>

      {isRecurring && (
        <>
          <Field label="Frequency" className="capitalize">
            {order?.recurringFrequency}
          </Field>
          {order?.nextBillingDate && (
            <Field label="Next Billing">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400" aria-hidden="true" />
                {formatShortDate(order.nextBillingDate)}
              </span>
            </Field>
          )}
        </>
      )}
    </div>
  </DetailCard>
)
