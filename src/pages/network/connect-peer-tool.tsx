import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useId, useState} from "react";

export default function ConnectPeerTool(props: { className?: string }) {
  const peerIdInputId = useId()
  const [peerIdOrAddr, setPeerIdOrAddr] = useState<string>('')

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
            onClick={() => {
            }}
          >Connect</Button>
        </CardFooter>
      </Card>
    </>
  )
}
