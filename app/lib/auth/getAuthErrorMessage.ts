import { AlertTriangle, Clock, Compass, Mail, Shield } from 'lucide-react'

const getAuthErrorMessage = (error: string) => {
  switch (error) {
    case 'AccessDenied':
      return {
        icon: Shield,
        title: 'Access Denied, Astronaut!',
        message:
          "Your clearance code isn't in our system, explorer! Only registered members of the Boys & Girls Club can access Mission Control. Contact our crew if you need assistance."
      }

    case 'Verification':
      return {
        icon: Clock,
        title: 'Launch Window Expired!',
        message:
          'That magic link has drifted into deep space, astronaut! The verification has expired or already been used. Request a new transmission to continue your mission.'
      }

    case 'EmailSignin':
      return {
        icon: Mail,
        title: 'Transmission Failed!',
        message:
          "Our signal couldn't reach your inbox, explorer! The email failed to send. Double-check your email address and request another transmission from ground control."
      }

    case 'OAuthSignin':
    case 'OAuthCallback':
      return {
        icon: AlertTriangle,
        title: 'Communication Array Offline!',
        message:
          "We're experiencing interference with the signin satellite, astronaut! There was trouble connecting to the authentication provider. Stand by and try again shortly."
      }

    case 'SessionRequired':
      return {
        icon: Lock,
        title: 'Crew Credentials Required!',
        message:
          'This sector is restricted to crew members only, explorer! You need to sign in before accessing this part of the station. Please authenticate to continue.'
      }

    case 'Configuration':
      return {
        icon: Compass,
        title: 'Navigation System Error!',
        message:
          'Our navigation systems are experiencing a glitch, astronaut! The technical crew at Boys & Girls Club is working on repairs. Please try again later.'
      }

    default:
      return {
        icon: AlertTriangle,
        title: 'Unknown Signal Detected!',
        message:
          "We've encountered an unexpected anomaly, explorer! Something went wrong during your mission. Please retry or contact ground control for assistance."
      }
  }
}

export default getAuthErrorMessage
