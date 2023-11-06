import PageTitle from "@/components/base/header/page-title";
import {Network} from "lucide-react";
import {useNetworkStore} from "@/stores/network-store";
import FindPeerTool from "./find-peer-tool";
import {Label} from "@/components/ui/label";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";
import ConnectPeerTool from "./connect-peer-tool";
import PeerTable from "./peer-table";
import MultiaddrTable from "./multiaddr-table";

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
      <PeerTable className="mb-8" peers={peers} />
      <h1 className="font-bold mb-4 text-xl">Self multiaddrs</h1>
      <MultiaddrTable className="mb-8" multiaddrs={multiaddrs} />
      <h1 className="font-bold mb-4 text-xl">Tools</h1>
      <div className="flex gap-4">
        <FindPeerTool className="w-1/2" />
        <ConnectPeerTool className="w-1/2" />
      </div>
    </div>
  )
}
