declare module 'next-pwa' {
  import { NextConfig } from 'next'

  type PWAConfig = {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    runtimeCaching?: Array<{
      urlPattern: RegExp
      handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'CacheOnly' | 'NetworkOnly'
      method?: string
      options?: {
        cacheName?: string
        expiration?: {
          maxEntries?: number
          maxAgeSeconds?: number
        }
        networkTimeoutSeconds?: number
        rangeRequests?: boolean
      }
    }>
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig

  export default withPWA
}
