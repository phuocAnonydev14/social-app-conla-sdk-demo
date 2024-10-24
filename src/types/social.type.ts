export interface Tokens {
  idToken: string;
  accessToken: string;
}

export interface SocialRedirectUri {
  redirectSignedIn: string;
  redirectSignedOut: string;
}

interface CommonSocialType {
  createdAt: string;
  updatedAt: string;
}

export interface UserSocialType extends CommonSocialType {
  email: string;
  id: string;
  encryptedKey: EncryptedKey[];
}

export interface EncryptedKey extends CommonSocialType {
  name: string;
  id: string;
  encryptedKey: string;
}

export interface PrivateKey {
  privateKey: string;
  encryptedKey: string;
  name: string;
}
