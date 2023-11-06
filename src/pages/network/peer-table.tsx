import {PeerId} from "@libp2p/interface/peer-id";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

export default function PeerTable({ peers, className }: { peers: PeerId[], className?: string }) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Peer ID</TableHead>
          <TableHead>ID type</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {peers.map((peer) => {
          const peerId = peer.toString()
          return (
            <TableRow key={peerId}>
              <TableCell className="font-medium">{peerId}</TableCell>
              <TableCell>{peer.type}</TableCell>
              <TableCell></TableCell>
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
