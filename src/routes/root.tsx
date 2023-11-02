import {Link} from "react-router-dom";
import {useUnitContainer} from "../units/UnitContainerProvider";
import {AuthUnit} from "../units/AuthUnit";
import {useMemo, useState} from "react";
import {P2pUnit} from "../units/P2pUnit";
import {Multiaddr} from "@multiformats/multiaddr";
import {PeerId} from "@libp2p/interface/peer-id";
import {peerIdFromPeerId, peerIdFromString} from "@libp2p/peer-id";

export default function Root() {
  const container = useUnitContainer()

  const auth = useMemo(() => container.resolve(AuthUnit), []);
  const p2p = useMemo(() => container.resolve(P2pUnit), []);
  const [multiaddrs, setMultiaddrs] = useState<Multiaddr[]>([])
  const [peers, setPeers] = useState<PeerId[]>([])

  const [remotePeerIdStr, setRemotePeerIdStr] = useState<string>('')

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          hello, {auth.username}
        </div>
        <div>
          your peerId is: {auth.getPeerId()?.toString()}
        </div>
        <nav>
          <ul>
            <li>
              <Link to={`/login`}>Login</Link>
            </li>
            <li>
              <Link to={`/home`}>Home</Link>
            </li>
          </ul>
        </nav>

        <div>
          <label>
            remote peer id:
            <input
              style={{ width: '100%'}}
              value={remotePeerIdStr}
              onChange={(event) => setRemotePeerIdStr(event.target.value)}
            />
          </label>
          <br />
          <button onClick={async () => {
            if (remotePeerIdStr) {
              const peerId = peerIdFromString(remotePeerIdStr)
              const addrs = await p2p.findPeer(peerId)
              if (addrs.length) {
                console.log('found')
              } else {
                alert('not found')
              }
            }
          }}>
            findPeer
          </button>
          <button onClick={async () => {
            if (remotePeerIdStr) {
              const peerId = peerIdFromString(remotePeerIdStr)
              const lat = await p2p.node.services.ping.ping(peerId)
              console.log('lat', lat)
            }
          }}>
            ping
          </button>
        </div>

        <button onClick={() => {
          setMultiaddrs(p2p.multiaddrs)
        }}>show multiaddr</button>

        <ul>
          {multiaddrs.map((multiaddr, index) => {
            return (
              <li key={index}>{multiaddr.toString()}</li>
            )
          })}
        </ul>

        <button onClick={() => {
          setPeers(p2p.peers)
        }}>show peers</button>
      </div>
      <ul>
        {peers.map((peer, index) => {
          return (
            <li key={index}>{peer.toString()}</li>
          )
        })}
      </ul>
    </>
  );
}
