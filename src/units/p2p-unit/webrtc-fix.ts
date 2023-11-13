import {
  WebRTCTransportComponents,
  WebRTCTransportInit
} from "@libp2p/webrtc/src/private-to-private/transport";
import {WebRTC} from "@multiformats/mafmt";
import {webRTC} from "@libp2p/webrtc";

export const webRTCFix = (init?: WebRTCTransportInit) => (comp: WebRTCTransportComponents) => {
  const w = webRTC(init)
  const rtc = w(comp)
  rtc.filter = (multiaddrs) => {
    return multiaddrs.filter((ma) => {
      return WebRTC.matches(ma)
    })
  }
  return rtc
}
