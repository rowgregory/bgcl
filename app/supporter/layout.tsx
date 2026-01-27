import PaymentMethodDrawer from '../components/drawers/PaymentMethodDrawer'

export default async function SupporterLayout({ children }) {
  return (
    <>
      <PaymentMethodDrawer />
      {children}
    </>
  )
}
