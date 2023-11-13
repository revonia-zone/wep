import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useNetworkStore} from "@/stores/network-store";
import IdentifyDialog from "./identify-dialog";
import {useState} from "react";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";

export default function PeerTable({ className }: { className?: string }) {
  const peerMap = useNetworkStore((s) => s.peerMap)

  const [dialogProps, setDialogProps] = useState({
    peerId: '',
    open: false,
  })

  const [latencyMap, setLatencyMap] = useState<Record<string, string>>({})

  return (
    <>
      <Table className={className}>
        <TableHeader>
          <TableRow>
            <TableHead>Peer ID</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(peerMap).map((idStr) => {
            const data = peerMap[idStr]
            return (
              <TableRow key={idStr}>
                <TableCell className="font-medium">
                  [{data.id.type}] {idStr}
                </TableCell>
                <TableCell>
                  {latencyMap[idStr] || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        setDialogProps({
                          peerId: idStr,
                          open: true,
                        })
                      }}
                    >
                      Identify
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        const p2p = container.resolve(P2pUnit)
                        setLatencyMap((map) => ({
                          ...map,
                          [idStr]: 'Ping...',
                        }))
                        try {
                          const latency = await p2p.node.services.ping.ping(data.id)
                          setLatencyMap((map) => ({
                            ...map,
                            [idStr]: `${latency}ms`
                          }))
                        } catch (e) {
                          setLatencyMap((map) => ({
                            ...map,
                            [idStr]: `Failed`
                          }))
                        }
                      }}
                    >
                      Ping
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <IdentifyDialog
        dialogProps={dialogProps}
        onClose={() => setDialogProps({ open: false, peerId: ''})}
      />
    </>
  )
}
