import {PeerId} from "@libp2p/interface/peer-id";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useNetworkStore} from "@/stores/network-store";

export default function PeerTable({ className }: { className?: string }) {
  const peerMap = useNetworkStore((s) => s.peerMap)

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Peer ID</TableHead>
          <TableHead>Protocols</TableHead>
          <TableHead>Tags</TableHead>
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
              <TableCell>{data.protocols.join(', ')}</TableCell>
              <TableCell>
                {Object.keys(data.tags).map((tag) => `${tag}:${data.tags[tag]}`).join(', ')}
              </TableCell>
              <TableCell>
                <Button variant="secondary" size="sm">
                  multiaddrs
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
