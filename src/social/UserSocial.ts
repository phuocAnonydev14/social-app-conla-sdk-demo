import {JsonRpcProvider} from "@ethersproject/providers";
import {Wallet} from "ethers";
import {fetchAuthSession} from "aws-amplify/auth";
import axios from "axios";
import {API_BASE_URL} from "./SocialConfig";
import {kmsService} from "./KmsService";
import {Tokens} from "../types/social.type";

export class UserSocial {

  public email?: string
  public id?: string
  public encryptionKey?: string
  public createdAt?: string
  public updatedAt?: string

  public async getTokens(code?: string): Promise<Tokens> {
    if (code) {
      console.log(code);
    }
    const tokenCognito = await fetchAuthSession();
    if (!tokenCognito || !tokenCognito.tokens) {
      throw new Error("User is not authorized");
    }
    return {
      idToken: tokenCognito.tokens.idToken?.toString() || '',
      accessToken: tokenCognito.tokens.accessToken?.toString() || '',
    }
  }

  getInformation = async (code?: string) => {
    try {
      if (code) {
        console.log(code);
      }
      const tokenCognito = await this.getTokens(code)
      const userResponse = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: "Bearer " + tokenCognito.idToken
        }
      })
      const {email, id, encryption_key, created_at, updated_at} = userResponse?.data?.data
      this.setInformation(email, id, encryption_key, created_at, created_at)
      return {
        user: {
          id: id,
          email,
          encryptionKey: encryption_key,
          created_at: created_at,
          updatedAt: updated_at
        },
        ...tokenCognito
      };
    } catch (e) {
      console.log(e);
    }
  };

  public setInformation(email: string, id: string, encryptionKey?: string, createdAt?: string, updatedAt?: string): void {
    this.email = email;
    this.id = id;
    this.encryptionKey = encryptionKey;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public async generatePrivateKey() {
    try {
      const idToken = (await this.getTokens()).idToken
      const provider = new JsonRpcProvider("https://aa-bundler.conla.com/rpc");
      const wallet = Wallet.createRandom(provider);
      const privateKey = wallet.privateKey;
      const privateKeyHashed = await kmsService.encryptPrivateKey(privateKey, idToken)
      if (!privateKeyHashed) {
        throw new Error("Hash private key failed");
      }
      const res = await axios.patch(`${API_BASE_URL}/me/key`, {
        encryption_key: privateKeyHashed
      }, {
        headers: {
          Authorization: "Bearer " + idToken
        }
      })
      if (res?.data?.encryption_key) {
        this.encryptionKey = res?.data?.encryption_key
      }
      return privateKey
    } catch (e) {
      console.log(e);
    }
  }

  public async getPrivateKey() {
    try {
      const idToken = (await this.getTokens()).idToken
      if (!this.encryptionKey) {
        return null
      }
      const privateKey = await kmsService.decryptPrivateKey(this.encryptionKey, idToken)
      return privateKey
    } catch (e) {
      console.log(e)
    }
  }

}
