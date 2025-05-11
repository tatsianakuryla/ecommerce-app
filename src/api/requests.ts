import { PermissionLevel } from '~types/types'
import { generatePermissions } from '~utils/helpers'
import { USER_AUTH_URL } from '~/constants/url'
const { VITE_CLIENT_ID, VITE_CLIENT_SECRET } = import.meta.env

export const createAuthRequest = (
  username: string,
  password: string,
): Request => {
  const userPermissions = generatePermissions(PermissionLevel.USER)

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
      Authorization: 'Basic ' + btoa(`${VITE_CLIENT_ID}:${VITE_CLIENT_SECRET}`),
    },
    body,
  })
}
