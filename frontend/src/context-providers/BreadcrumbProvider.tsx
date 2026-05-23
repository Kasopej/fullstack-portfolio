'use client'
import { MenuItem } from '@/types/navigation.types'
import { createContext, useContext, useState } from 'react'

type BreadcrumbContextType = {
  additonalRoutes: Readonly<MenuItem[]>
  setAdditionalRoutes: (routes: MenuItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  additonalRoutes: [],
  setAdditionalRoutes: () => {},
})

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [additonalRoutes, setAdditionalRoutes] = useState<MenuItem[]>([])
  return (
    <BreadcrumbContext.Provider value={{ additonalRoutes, setAdditionalRoutes }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext)
}
