import AuthLayout from './components/AuthLayout'

export default function AuthLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}
