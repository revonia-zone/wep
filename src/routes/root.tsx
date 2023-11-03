import {AuthUnit} from "@/units/auth-unit";
import {P2pUnit} from "@/units/p2p-unit";
import {Outlet} from "react-router-dom";
import {container} from "tsyringe";
import Layout from "@/components/base/layout";
import {useUserStore} from "@/stores/user-store";
import {NetworkStatus, useNetworkStore} from "@/stores/network-store";

export async function rootLoader() {
  const auth = container.resolve(AuthUnit)
  const p2p = container.resolve(P2pUnit)
  let user = await auth.getCurrentUser()
  if (!user) {
    user = await auth.createGuestUser()
    auth.setCurrentUser(user)
  }
  await p2p.start()
  useUserStore.getState().login(user)

  const networkState = useNetworkStore.getState()

  networkState.update({ status: NetworkStatus.CONNECTED })

  p2p.node.addEventListener('peer:connect', () => {
    networkState.update({ peers: p2p.node.getPeers() })
  })

  p2p.node.addEventListener('self:peer:update', (evt) => {
    networkState.update({ multiaddrs: p2p.node.getMultiaddrs() })
  })

  return null
}


export default function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
