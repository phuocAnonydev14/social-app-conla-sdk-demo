import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, Wallet } from "ethers";
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import { API_BASE_URL } from "./SocialConfig";
import { kmsService } from "./KmsService";
import {
  EncryptedKey,
  PrivateKey,
  Tokens,
  UserSocialType,
} from "../types/social.type";
import { httpConfig } from "./http";

export class UserSocial {
  public email?: string;
  public id?: string;
  public encryptionKeys?: EncryptedKey[] = [];
  public createdAt?: string;
  public updatedAt?: string;

  public async getTokens(code?: string): Promise<Tokens> {
    try {
      if (code) {
        console.log(code);
      }
      const tokenCognito = await fetchAuthSession();
      if (!tokenCognito || !tokenCognito.tokens) {
        throw new Error("User is not authorized");
      }
      return {
        idToken: tokenCognito.tokens.idToken?.toString() || "",
        accessToken: tokenCognito.tokens.accessToken?.toString() || "",
      };
    } catch (e) {
      throw e;
    }
  }

  public async getInformation(code?: string) {
    try {
      if (code) {
        console.log(code);
      }
      const tokenCognito = await this.getTokens(code);
      const userResponse = await axios.get(
        `${API_BASE_URL}/me`,
        httpConfig(tokenCognito.idToken)
      );
      const encryptionKey = await axios.get(
        `${API_BASE_URL}/keys`,
        httpConfig(tokenCognito.idToken)
      );
      const formatedEncryptionKey = encryptionKey?.data?.data.map(
        (key: any) => {
          return {
            name: key.name,
            id: key.id,
            encryptedKey: key.encryption_key,
            created_at: key.created_at,
            updated_at: key.updated_at,
          };
        }
      );
      const { email, id, created_at, updated_at } = userResponse?.data?.data;
      this.setInformation(
        email,
        id,
        formatedEncryptionKey,
        created_at,
        created_at
      );
      return {
        user: {
          id: id,
          email,
          encryptedKey: formatedEncryptionKey,
          createdAt: created_at,
          updatedAt: updated_at,
        } as UserSocialType,
        ...tokenCognito,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async checkToken(idToken?: string) {
    try {
      let idTokenDispatch = idToken;
      if (!idTokenDispatch) {
        idTokenDispatch = (await this.getTokens()).idToken;
      }
      return idTokenDispatch;
    } catch (e) {
      return "";
    }
  }

  public async deletePrivateKey(keyId: string, idToken: string) {
    try {
      return await axios.delete(
        `${API_BASE_URL}/keys/${keyId}`,
        httpConfig(idToken)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public setInformation(
    email: string,
    id: string,
    encryptionKey?: EncryptedKey[],
    createdAt?: string,
    updatedAt?: string
  ): void {
    this.email = email;
    this.id = id;
    this.encryptionKeys = encryptionKey || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public async generatePrivateKey(name?: string, idToken?: string) {
    try {
      const idTokenDispatch = await this.checkToken(idToken);
      const provider = new JsonRpcProvider("https://aa-bundler.conla.com/rpc");
      const wallet = Wallet.createRandom(provider);
      const privateKey = wallet.privateKey;
      await this.hashAndUpdatePrivateKey(privateKey, idTokenDispatch, name);
      return privateKey;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async hashAndUpdatePrivateKey(
    privateKey: string,
    idToken: string,
    name?: string
  ) {
    try {
      const privateKeyHashed = await kmsService.encryptPrivateKey(
        privateKey,
        idToken
      );
      if (!privateKeyHashed) {
        throw new Error("Hash private key failed");
      }

      let privateKeyName = name;
      if (!privateKeyName) {
        privateKeyName = `Conla account ${
          (this.encryptionKeys?.length || 0) + 1
        }`;
      }
      const res = await axios.post(
        `${API_BASE_URL}/keys`,
        {
          encryption_key: privateKeyHashed,
          name: privateKeyName,
          address: ethers.utils.computeAddress(privateKey),
        },
        {
          headers: {
            Authorization: "Bearer " + idToken,
          },
        }
      );
      if (res?.data?.encryption_key) {
        this.encryptionKeys = res?.data?.encryption_key;
      }
    } catch (e) {}
  }

  public async getPrivateKey(idToken?: string): Promise<PrivateKey[]> {
    try {
      const idTokenDispatch = await this.checkToken(idToken);
      if (!this.encryptionKeys) {
        return [];
      }
      const privateKey = await kmsService.decryptPrivateKey(
        this.encryptionKeys,
        idTokenDispatch
      );
      return privateKey;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async syncPrivateKey(
    privateKey: string,
    idToken?: string,
    name?: string
  ) {
    try {
      const idTokenDispatch = await this.checkToken(idToken);
      await this.hashAndUpdatePrivateKey(privateKey, idTokenDispatch, name);
      return privateKey;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
