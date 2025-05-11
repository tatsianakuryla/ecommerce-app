import { http, HttpResponse } from 'msw'
import { mockResponses } from '~fixtures/fixture.json'
import { USER_AUTH_URL } from '~/constants/url'

export const handlers = [
  http.post(USER_AUTH_URL, () => {
    localStorage.setItem('access_token', mockResponses.successAuth.access_token)
    return HttpResponse.json(mockResponses.successAuth)
  }),
]
