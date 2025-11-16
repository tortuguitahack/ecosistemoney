import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../server/routers/index.js'

export const trpc = createTRPCReact<AppRouter>()

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001/api/trpc',
        headers() {
          return {
            'x-client-info': 'ecosystem-automation-dashboard',
          }
        },
      }),
    ],
  })
}