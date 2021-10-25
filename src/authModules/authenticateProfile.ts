import { Response } from 'express'
import { requestCredentials } from '../@types/types'
import { Credentials, Credential } from '@oceanprotocol/lib'

async function checkCredentials(
  credentialArray: Credential[],
  profile: any,
  credentials: requestCredentials
): Promise<boolean> {
  if (credentialArray === undefined || credentialArray.length === 0) {
    return true
  } else {
    for (let i = 0; i < credentialArray.length; i++) {
      const type = credentialArray[i].type
      for (let j = 0; j < credentialArray[i].values.length; j++) {
        const value = credentialArray[i].values[j]

        if (type === 'address' && value === credentials.value) {
          return true
        } else if (value === profile[`${type}`]) {
          return true
        }
      }
    }
    return false
  }
}

async function authenticateProfile(
  res: Response,
  profile: any,
  credentials: requestCredentials,
  ddoCredentials: Credentials
): Promise<boolean> {
  const isAllowed = await checkCredentials(
    ddoCredentials.allow,
    profile,
    credentials
  )
  const isDenied = await checkCredentials(
    ddoCredentials.deny,
    profile,
    credentials
  )

  if (isAllowed === false || isDenied === true) {
    return false
  } else {
    return true
  }
}

export default authenticateProfile
