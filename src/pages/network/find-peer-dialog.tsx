import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";
import {useEffect, useRef, useState} from "react";
import {peerIdFromString} from "@libp2p/peer-id";
import {EventTypes} from "@libp2p/kad-dht";

interface Props {
  findProps: FindProps
  onClose: () => void
}

export interface FindProps {
  peerId: string
  open: boolean
}

export default function FindPeerDialog({findProps, onClose}: Props) {
  const { peerId, open } = findProps

  const p2p = container.resolve(P2pUnit)
  const [lines, setLines] = useState<string[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const controller = new AbortController()
      const run = async () => {
        try {
          const id = peerIdFromString(peerId)
          const events = p2p.node.services.dht.findPeer(id, {
            signal: controller.signal
          })
          for await (const event of events) {
            if (controller.signal.aborted) {
              return
            }
            switch (event.type) {
              case EventTypes.DIAL_PEER:
                setLines((lines) => [...lines, `Dialing peer ${event.peer.toString()}`])
                break
              case EventTypes.SEND_QUERY:
                setLines((lines) => [...lines, `Sent query to peer ${event.to.toString()}`])
                break
              case EventTypes.QUERY_ERROR:
                setLines((lines) => [...lines, `Query error: ${event.error}`])
                break
              case EventTypes.FINAL_PEER:
                setLines((lines) => [
                  ...lines,
                  `Found, peer multiaddrs`,
                  ...event.peer.multiaddrs.map((multiaddr) => multiaddr.toString())
                ])
                break;
              default:
                console.log(event)
            }
            setTimeout(() => {
              if (outputRef.current) {
                outputRef.current.scrollTo(0, outputRef.current.scrollHeight)
              }
            }, 0)
          }
        } catch (e) {
          setLines((lines) => [...lines, `${e}`])
        }
      }
      setTimeout(() => {
        if (controller.signal.aborted) {
          return
        }
        run()
      }, 500)
      return () => {
        controller.abort()
      }
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setLines([])
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Finding peer...</DialogTitle>
          <DialogDescription>
            PeerId: {peerId}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-64 bg-black overflow-auto p-2 text-white text-sm font-mono" ref={outputRef}>
          {lines.map((line, index) => <div className="hover:bg-gray-600 break-all" key={index}>{line}</div>)}
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              setLines([])
              onClose()
            }}
          >Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
