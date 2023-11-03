import PageTitle from "@/components/base/page-title";
import {Network} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {PeerId} from "@libp2p/interface/peer-id";
import {useNetworkStore} from "@/stores/network-store";
import {Multiaddr} from "@multiformats/multiaddr";
import FindPeerTool from "@/pages/network/find-peer-tool";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";

function PeerIdTable({ peers, className }: { peers: PeerId[], className?: string }) {
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


function MultiaddrTable({ multiaddrs, className }: { multiaddrs: Multiaddr[], className?: string }) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Multiaddr</TableHead>
          <TableHead>Protocols</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {multiaddrs.map((multiaddr) => {
          const string = multiaddr.toString()
          return (
            <TableRow key={string}>
              <TableCell className="font-medium">{string}</TableCell>
              <TableCell>{multiaddr.protoNames().join(', ')}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function NetworkPage() {
  const peers = useNetworkStore((s) => s.peers)
  const multiaddrs = useNetworkStore((s) => s.multiaddrs)
  const p2p = container.resolve(P2pUnit)

  return (
    <div>
      <PageTitle
        text="Network"
        icon={Network}
      />
      <h1 className="font-bold mb-4 text-xl">Basic</h1>
      <div className="mb-8">
        <div>
          <Label className="text-base">PeerId:{' '}</Label>
          <span className="text-base">{p2p.node.peerId.toString()}</span>
        </div>
      </div>

      <h1 className="font-bold mb-4 text-xl">Connected peers</h1>
      <PeerIdTable className="mb-8" peers={peers} />
      <h1 className="font-bold mb-4 text-xl">Self multiaddrs</h1>
      <MultiaddrTable className="mb-8" multiaddrs={multiaddrs} />
      <h1 className="font-bold mb-4 text-xl">Tools</h1>
      <FindPeerTool />
    </div>
  )
}
