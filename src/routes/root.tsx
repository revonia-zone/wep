import {Link} from "react-router-dom";
import {useUnitContainer} from "../units/UnitContainerProvider";
import {AuthUnit} from "../units/AuthUnit";
import {useMemo, useState} from "react";
import {P2pUnit} from "../units/P2pUnit";
import {Multiaddr} from "@multiformats/multiaddr";

export default function Root() {
  const container = useUnitContainer()

  const auth = useMemo(() => container.resolve(AuthUnit), []);
  const p2p = useMemo(() => container.resolve(P2pUnit), []);
  const [multiaddrs, setMultiaddrs] = useState<Multiaddr[]>([])

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
      </div>
      <div id="detail"></div>
    </>
  );
}
