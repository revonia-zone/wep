import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useId, useState} from "react";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";
import {multiaddr} from "@multiformats/multiaddr";
import {peerIdFromString} from "@libp2p/peer-id";
import {Connection} from "@libp2p/interface/src/connection";

export default function ConnectPeerTool(props: { className?: string }) {
  const peerIdInputId = useId()
  const [peerIdOrAddr, setPeerIdOrAddr] = useState<string>('')

  const p2p = container.resolve(P2pUnit)

  return (
    <>
      <Card className={props.className}>
        <CardHeader>
          <CardTitle>Connect peer</CardTitle>
          <CardDescription>Connect peer manual by Peer ID or multiaddr</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={peerIdInputId}>Peer ID/Multiaddr</Label>
                <Input
                  id={peerIdInputId}
                  value={peerIdOrAddr}
                  onChange={(evt) => setPeerIdOrAddr(evt.target.value)}
                  placeholder="Type a peer id or multiaddr to connect"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            disabled={!peerIdOrAddr}
            onClick={async () => {
              let conn: Connection
              try {
                if (peerIdOrAddr.startsWith('/')) {
                  conn = await p2p.node.dial(multiaddr(peerIdOrAddr))
                } else {
                  conn = await p2p.node.dial(peerIdFromString(peerIdOrAddr))
                }

                console.log('connect success', conn)
              } catch (e) {
                console.log('connect failed', e)
              }

            }}
          >Connect</Button>
        </CardFooter>
      </Card>
    </>
  )
}
