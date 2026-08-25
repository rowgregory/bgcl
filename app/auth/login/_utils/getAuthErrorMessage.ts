import { AlertTriangle, Clock, Lock, Mail, Settings, Shield } from 'lucide-react'

const getAuthErrorMessage = (error: string) => {
  switch (error) {
    case 'AccessDenied':
      return {
        icon: Shield,
        title: 'Access denied',
        message:
          "This email isn't authorized to sign in. Only registered Boys & Girls Club staff can access the portal. Contact us if you think this is a mistake."
      }

    case 'Verification':
      return {
        icon: Clock,
        title: 'Link expired',
        message: 'That sign-in link has expired or was already used. Request a new one to continue.'
      }

    case 'EmailSignin':
      return {
        icon: Mail,
        title: "Couldn't send email",
        message: 'We were unable to send your sign-in link. Check your email address and try again.'
      }

    case 'OAuthSignin':
    case 'OAuthCallback':
      return {
        icon: AlertTriangle,
        title: 'Connection problem',
        message: 'We had trouble connecting to the sign-in provider. Please wait a moment and try again.'
      }

    case 'SessionRequired':
      return {
        icon: Lock,
        title: 'Sign in required',
        message: 'You need to be signed in to view this page. Please sign in to continue.'
      }

    case 'Configuration':
      return {
        icon: Settings,
        title: 'Configuration error',
        message: "Something isn't set up correctly on our end. We're looking into it — please try again later."
      }

    default:
      return {
        icon: AlertTriangle,
        title: 'Something went wrong',
        message:
          'An unexpected error occurred while signing in. Please try again, or contact us if the problem continues.'
      }
  }
}

export default getAuthErrorMessage
