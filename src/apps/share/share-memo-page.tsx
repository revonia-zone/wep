import {useEffect, useRef, useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import EditorJS, {OutputData} from "@editorjs/editorjs";
import PageTitle from "@/components/base/header/page-title";
import {File} from "lucide-react";
import {Button} from "@/components/ui/button";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";
import {peerIdFromString} from "@libp2p/peer-id";
import {EventTypes} from "@libp2p/kad-dht";
import {Multiaddr} from "@multiformats/multiaddr";

export default function ShareMemoPage() {

  const [title, setTitle] = useState('Untitled')

  const { userId, memoId} = useParams()
  const [searchParams] = useSearchParams()
  const peerId = searchParams.get('peerId')

  const editorElRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS | null>(null)

  const [data, setData] = useState<{
    title: string
    data: OutputData
  } | null>(null)

  useEffect(() => {
    const run = async () => {
      if (peerId) {
        const id = peerIdFromString(peerId)
        const p2p = container.resolve(P2pUnit)
        const findEvent = p2p.node.services.dht.findPeer(id)
        let foundAddrs: Multiaddr[] = []
        for await (const findEventElement of findEvent) {
          if (findEventElement.type === EventTypes.FINAL_PEER) {
            foundAddrs = findEventElement.peer.multiaddrs
            break
          }
        }

        if (foundAddrs.length) {
          const conn = await p2p.node.dial(id)
          const topic = `libmemo-${memoId}}`
          p2p.node.services.pubsub.subscribe(topic)
          p2p.node.services.pubsub.addEventListener('message', async (evt) => {
            const d = new TextDecoder('utf-8')
            const msg = JSON.parse(d.decode(evt.detail.data))
            switch (msg.type) {
              case 'get-reply':
                setData(msg.data)
            }
          })
          const encoder = new TextEncoder()
          const data = encoder.encode(JSON.stringify({
            type: 'get'
          }))
          p2p.node.services.pubsub.publish(topic, data)
        }
      }
    }
    run()
  }, [userId, memoId, peerId]);



  useEffect(() => {
    if (editorRef.current) {
      return
    }
    const editor = new EditorJS({
      holder: editorElRef.current!,
      placeholder: 'Type any thing you want memory...'
    });
    editorRef.current = editor
  }, [])

  useEffect(() => {
    if (data && editorRef.current) {
      editorRef.current?.render(data.data)
      setTitle(data.title)
    }
  }, [data]);


  return (
    <div>
      <PageTitle text={title} icon={File}/>
      <div>
        <input
          autoFocus
          className="text-xl outline-none max-w-[650px] w-full mx-auto block my-8"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div ref={editorElRef}></div>
    </div>
  )
}
