import Google from 'next-auth/providers/google'

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth environment variables')
}

const googleProvider = Google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  allowDangerousEmailAccountLinking: true,
  authorization: {
    params: {
      prompt: 'select_account'
    }
  },
  // The adapter passes this straight to user.create, so custom columns land here
  profile(profile) {
    return {
      id: profile.sub,
      email: profile.email,
      firstName: profile.given_name ?? '',
      lastName: profile.family_name ?? ''
    }
  }
})

export default googleProvider
