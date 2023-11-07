import {useEffect, useRef} from "react";
import {useViewStore} from "@/stores/view-store";

export default function Header() {
  const titleRef = useRef<HTMLDivElement | null>(null)

  const setTitleEl = useViewStore((s) => s.setTitleEl)

  useEffect(() => {
    setTitleEl(titleRef.current)
  });

  return (
    <div className="h-12 py-2 px-4 border-b-gray-100 border-b flex">
      <div className="flex-1 leading-8 flex items-stretch" ref={titleRef}></div>
    </div>
  )
}
