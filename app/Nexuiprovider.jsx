// app/providers.tsx

import {NextUIProvider} from '@nextui-org/react'

export function NextUiProviders({ children }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}