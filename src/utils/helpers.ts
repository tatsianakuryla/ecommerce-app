import { permissions } from '~constants/permissions'
import { PermissionLevel } from '~types/types'

const clientName = import.meta.env.VITE_API_CLIENT_NAME

export const generatePermissions = (permissionLevel: PermissionLevel) => {
  return Object.values(permissions[permissionLevel])
    .map((permission) => `${permission}:${clientName}`)
    .join(' ')
}
