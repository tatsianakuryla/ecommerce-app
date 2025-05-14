import { generatePermissions } from '~utils/helpers'
import { BASIC_AUTH_HEADER, USER_AUTH_URL } from '~/constants/constants'

export const createUserAuthRequest = (
  username: string,
  password: string,
): Request => {
  const userPermissions = generatePermissions()

  const body = new URLSearchParams({
    grant_type: 'password',
    username,
    password,
    scope: userPermissions,
  })

  return new Request(USER_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: BASIC_AUTH_HEADER,
    },
    body,
  })
}
