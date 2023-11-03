import {DataUnit} from "./data-unit";
import {generateKeyPair, importKey } from "@libp2p/crypto/keys";
import {createFromPrivKey} from "@libp2p/peer-id-factory";
import {randomBytes} from "crypto";
import {PeerId} from "@libp2p/interface/peer-id";
import {injectable, singleton} from "tsyringe";
import {EventUnit} from "./event-unit";

export interface UserInfo {
  username: string
  privateKey: string
  peerId: PeerId
}

@injectable()
@singleton()
export class AuthUnit {
  get username() {
    return this.currentUser?.username || null
  }

  private currentUser: UserInfo | null = null

  constructor(
    private eventUnit: EventUnit,
    private dataUnit: DataUnit
  ) {
  }

  getPeerId() {
    return this.currentUser?.peerId
  }

  setCurrentUser(userInfo: UserInfo) {
    if (this.currentUser && this.currentUser.peerId.toString() == userInfo.peerId.toString()) {
      return
    }
    this.currentUser = userInfo
    this.eventUnit.dispatchEvent(new CustomEvent('wep:user:change', {
      detail: userInfo
    }))
    this.eventUnit.dispatchEvent(new CustomEvent('wep:unit:update'))
    this.dataUnit.writeSessionData('user', userInfo)
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser
    }
    const data = this.dataUnit.readSessionData('user')
    if (data) {
      const privateKey = await importKey(data.privateKey, 'guest')

      const peerId = await createFromPrivKey(privateKey)
      const userInfo: UserInfo = {
        username: data.username,
        privateKey: data.privateKey,
        peerId,
      }
      this.setCurrentUser(userInfo)
      return userInfo
    }
    return null
  }

  async createGuestUser() {
    const key = await generateKeyPair('Ed25519')
    const peerId = await createFromPrivKey(key)
    const privateKey = await key.export('guest')

    const userInfo: UserInfo = {
      privateKey,
      peerId,
      username: `guest`
    }
    return userInfo
  }

  async createNewUser(username: string, password: string) {
    const challenge = randomBytes(128)
    const userId = randomBytes(32)

    const credInfo = await navigator.credentials.create({
      publicKey: {
        authenticatorSelection: {
          authenticatorAttachment: 'cross-platform',
          userVerification: 'discouraged',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
        ],
        challenge,
        user: {
          name: username,
          id: userId,
          displayName: username,
        },
        rp: {
          name: 'Example Inc.',
          id: 'example.com',
        }
      }
    })

    const key = await generateKeyPair('Ed25519')
    const peerId = await createFromPrivKey(key)
    const privateKey = await key.export('password')
    const user = {
      privateKey,
      username,
      peerId
    }

    console.log(user)
    return user
  }

  async requestAuth(username: string) {

  }
}
