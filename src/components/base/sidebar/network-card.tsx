import {Button} from "@/components/ui/button";
import { Router, Signal, Waypoints} from "lucide-react";
import {useNetworkStore} from "@/stores/network-store";
import {useNavigate} from "react-router-dom";

export default function NetworkCard() {
  const {status, peers, multiaddrs} = useNetworkStore()
  const navigate = useNavigate();

  return (
    <div className="w-full h-10 py-1 px-2">
      <Button
        variant="ghost"
        className="w-full h-full py-1 text-xs"
        onClick={() => {
          navigate('/network')
        }}
      >
        <div className="flex gap-8">
          <span>
            <Signal className="inline-block" size={16} strokeWidth={1.5}/>
            {' '}
            {status}
          </span>
          <span>
            <Waypoints className="inline-block" size={16} strokeWidth={1.5}/>
            {' '}
            {peers.length}
          </span>
          <span>
            <Router className="inline-block" size={16} strokeWidth={1.5}/>
            {' '}
            {multiaddrs.length}
          </span>
        </div>
      </Button>
    </div>
  )
}
