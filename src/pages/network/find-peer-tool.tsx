import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useId, useState} from "react";
import FindPeerDialog from "@/pages/network/find-peer-dialog";

export default function FindPeerTool(props: { className?: string }) {
  const peerIdInputId = useId()
  const [peerId, setPeerId] = useState<string>('')

  const [findProps, setFindProps] = useState({
    peerId: '',
    open: false,
  })

  return (
    <>
      <Card className={props.className}>
        <CardHeader>
          <CardTitle>Find peer</CardTitle>
          <CardDescription>Find peer by DHT network</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={peerIdInputId}>Peer ID</Label>
                <Input
                  id={peerIdInputId}
                  value={peerId}
                  onChange={(evt) => setPeerId(evt.target.value)}
                  placeholder="Which peer you want?"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            disabled={!peerId}
            onClick={() => {
              setFindProps({
                peerId,
                open: true,
              })
            }}
          >Find</Button>
        </CardFooter>
      </Card>
      <FindPeerDialog
        findProps={findProps}
        onClose={() => setFindProps({peerId: '', open: false})}
      />
    </>
  )
}
