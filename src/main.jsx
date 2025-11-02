import React, { useMemo, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css'


import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  lightTheme
} from '@rainbow-me/rainbowkit'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 👇 You define your custom chain here
const besuEduChain = {
  id: 424242,
  name: 'Besu EduNet',
  nativeCurrency: {
    name: 'EDU-D',
    symbol: 'EDU-D',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dimikog.org/rpc/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockexplorer.dimikog.org',
    },
  },
  testnet: true,
}

// ✅ use getDefaultConfig instead of createConfig + connectors
const config = getDefaultConfig({
  appName: 'Web3EduDAOInvite',
  projectId: '8c186ed37e4b07878dfdc291e9d4ab5a', // 🔥 required
  chains: [besuEduChain],
  ssr: false,
})

// Required for wagmi v2
const queryClient = new QueryClient()

function RootApp() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const rainbowKitTheme = useMemo(
    () => (isDarkMode ? darkTheme() : lightTheme()),
    [isDarkMode]
  )

  const handleToggleDarkMode = () => {
    setIsDarkMode((previous) => !previous)
  }

  return (
    <RainbowKitProvider
      chains={[besuEduChain]}
      theme={rainbowKitTheme}
    >
      <App isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />
    </RainbowKitProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RootApp />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
