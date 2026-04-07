import { getServerDevice } from '@/lib/utils/server'
import AuthLayout from './components/AuthLayout'

export default async function AuthLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const deviceType = await getServerDevice()
  return (
    <AuthLayout isMobilePreset={deviceType === 'phone'}>
      {children}
    </AuthLayout>
  )
}
