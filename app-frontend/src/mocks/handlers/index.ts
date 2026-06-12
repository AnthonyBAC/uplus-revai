import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/auth/session', () => {
    return HttpResponse.json({
      user: { id: '1', email: 'test@test.com', fullName: 'Test User' },
      memberships: [],
    })
  }),
]
