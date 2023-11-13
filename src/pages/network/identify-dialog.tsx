import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";
import {useEffect, useRef, useState} from "react";
import {peerIdFromString} from "@libp2p/peer-id";

interface Props {
  dialogProps: DialogProps
  onClose: () => void
}

export interface DialogProps {
  peerId: string
  open: boolean
}

export default function IdentifyDialog({dialogProps, onClose}: Props) {
  const { peerId, open } = dialogProps

  const [lines, setLines] = useState<string[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const p2p = container.resolve(P2pUnit)
      const controller = new AbortController()

      const run = async () => {
        try {
          const id = peerIdFromString(peerId)
          const conn = p2p.node.getConnections(id)
          if (!conn.length) {
            setLines((lines) => [...lines, `No Connection to peer ${id.toString()}`])
            return
          }

          setLines((lines) => [...lines, `Identify peer ${id.toString()}...`])

          const result = await p2p.node.services.identify.identify(conn[0], {
            signal: controller.signal,
          })

          setLines((lines) => [
            ...lines,
            `Protocol Version: ${result.protocolVersion}`,
            `Agent Version: ${result.agentVersion}`,
            '-------------------------',
            `Listen Addresses:`,
            ...result.listenAddrs.map((addr) => `  ${addr.toString()}`),
            '-------------------------',
            `Protocols:`,
            ...result.protocols.map((protocol) => `  ${protocol}`),
            '-------------------------',
          ])

        } catch (e) {
          setLines((lines) => [...lines, `${e}`])
        }
      }
      setTimeout(() => {
        if (controller.signal.aborted) {
          return
        }
        run()
      }, 100)

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
          <DialogTitle>Identify peer...</DialogTitle>
          <DialogDescription>
            PeerId: {peerId}
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-96 bg-black overflow-auto p-2 text-white text-sm font-mono whitespace-pre-wrap" ref={outputRef}>
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
