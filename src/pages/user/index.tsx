import PageTitle from "@/components/base/header/page-title";
import {User} from "lucide-react";
import {Button} from "@/components/ui/button";
import * as crypto from "crypto";

function buf2hex(buffer: any) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

async function test() {
  const challenge = crypto.randomBytes(32)
  const id = crypto.randomBytes(16)
  const idStr = id.toString('base64')
  console.log('id', idStr)

  const cred = await navigator.credentials.create({
    publicKey: {
      "challenge": challenge,
      "rp": {
        "name": "Passkey Example",
        "id": window.location.hostname
      },
      "user": {
        "id": id,
        "name": `Michael-${buf2hex(id)}`,
        "displayName": `Michael-${buf2hex(id)}`
      },
      "pubKeyCredParams": [
        {
          "alg": -7,
          "type": "public-key"
        }
      ],
      "timeout": 60000,
      "attestation": "none",
      "excludeCredentials": [
      ],
      "authenticatorSelection": {
        "authenticatorAttachment": "platform",
        "requireResidentKey": true,
        "residentKey": "required"
      },
      "extensions": {
        // @ts-ignore
        largeBlob: {
          support: "preferred"
        },
        "credProps": true
      }
    }
  });

  if (!cred) {
    return
  }
  const publicKey = (cred as any).response.attestationObject
  console.log('cred', cred)
}

const base64_string = 'cnXfiEb9Fxf87nVGt8fp3ILCKXYKOVNJCsH4lG/pNvs='

let random = Uint8Array.from(atob(base64_string), c => c.charCodeAt(0))

async function login() {

  const cred2 = await navigator.credentials.get({
    publicKey: {
      "challenge": random,
      "allowCredentials": [],
      "timeout": 60000,
      "rpId": window.location.hostname,
      extensions: {
        // @ts-ignore
        hmacCreateSecret: {
          salt1: '1234567890'
        },
      }
    }
  });

  const arrayBuffer = (cred2 as any).response.userHandle
  debugger



  let base64String = buf2hex(arrayBuffer)

  console.log(base64String)
  console.log(cred2)
}

export default function UserPage() {
  return (
    <div>
      <PageTitle
        text="User"
        icon={User}
      />

      <Button onClick={() => {
        console.log('Create user')
        test()
      }}>
        Create user
      </Button>

      <Button onClick={() => {
        console.log('Create user')
        login()
      }}>
        Login
      </Button>
    </div>
  )
}
