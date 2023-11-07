import EditorJS from '@editorjs/editorjs';
import {useEffect, useRef, useState} from "react";
import PageTitle from "@/components/base/header/page-title";
import {File} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useParams} from "react-router-dom";
import {container} from "tsyringe";
import {P2pUnit} from "@/units/p2p-unit";

export default function MemoEditPage() {
  const [title, setTitle] = useState('Untitled')

  const { memoId} = useParams()

  const editorElRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS | null>(null)

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


  return (
    <div>
      <PageTitle text={title} icon={File}/>
      <Button
        onClick={() => {
          const p2p = container.resolve(P2pUnit)
          const peerId = p2p.node.peerId.toString()
          const u = new URL(`/discover/share/test/memo/${memoId}`, window.location.origin);
          u.searchParams.append('peerId', peerId)
          console.log(u.toString())
          p2p.node.services.pubsub.subscribe(`libmemo-${memoId}}`)
          p2p.node.services.pubsub.addEventListener('message', async (evt) => {
            const d = new TextDecoder('utf-8')
            const msg = JSON.parse(d.decode(evt.detail.data))
            switch (msg.type) {
              case 'get':
                const encoder = new TextEncoder()
                encoder.encode(JSON.stringify({
                  type: 'get-reply',
                  data: {
                    title: title,
                    data: await editorRef.current?.save()
                  }
                }))
            }
          })
        }}
      >
        Share this memo
      </Button>
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
