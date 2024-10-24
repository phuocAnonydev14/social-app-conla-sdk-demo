import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import {
  IDENTITY_POOL_ID,
  KMS_KEY_ID,
  REGION,
  USER_POOL_ID,
} from "./SocialConfig";
import { DecryptCommand, EncryptCommand, KMSClient } from "@aws-sdk/client-kms";
import { EncryptedKey, PrivateKey } from "../types/social.type";

export class KmsService {
  public async getKmsClient(idToken: string): Promise<KMSClient> {
    const credentials = fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: IDENTITY_POOL_ID,
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`]: idToken,
      },
    });
    return new KMSClient({
      region: REGION,
      credentials,
    });
  }

  public async encryptPrivateKey(privateKey: string, idToken: string) {
    try {
      const client = await this.getKmsClient(idToken);
      const command = new EncryptCommand({
        KeyId: KMS_KEY_ID,
        Plaintext: Buffer.from(privateKey, "utf-8"),
      });
      const privateKeyHashedRes = await client.send(command);
      // convert private key hash to hex string
      const privateKeyHexHashed = Array.from(
        privateKeyHashedRes.CiphertextBlob as Uint8Array
      )
        .map((b: any) => b.toString(16).padStart(2, "0"))
        .join("");
      return privateKeyHexHashed;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async decryptPrivateKey(
    encryptedKeys: EncryptedKey[],
    idToken: string
  ): Promise<PrivateKey[]> {
    try {
      const client = await this.getKmsClient(idToken);
      const res = await Promise.all(
        encryptedKeys.map(async (key) => {
          const command = new DecryptCommand({
            CiphertextBlob: Buffer.from(key.encryptedKey, "hex"),
          });
          const data = await client.send(command); // Plaintext ascii returned
          const asciiArray =
            data.Plaintext?.toString().split(",").map(Number) || [];
          const privateKey = asciiArray
            .map((code: number) => String.fromCharCode(code))
            .join("");
          return {
            id: key.id,
            name: key.name,
            privateKey,
            encryptedKey: key.encryptedKey,
          };
        })
      );

      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

export const kmsService = new KmsService();
