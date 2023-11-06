import {useEffect} from "react";
import {createPortal} from "react-dom";
import {usePageStore} from "@/stores/page-store";
import {LucideIcon} from "lucide-react";

interface Props {
  text: string
  icon?: LucideIcon
}

export default function PageTitle({ text, icon: Icon }: Props) {
  const titleEl = usePageStore((s) => s.titleEl)
  const setTitleText = usePageStore((s) => s.setTitleText)

  useEffect(() => {
    document.title = text;
    setTitleText(text)
  }, [text]);

  if (titleEl) {
    return createPortal(
      <div className="flex items-center">
        {Icon && <Icon size={16} strokeWidth={1.5} className="mr-4" />}
        <span>{text}</span>
      </div>,
      titleEl
    )
  } else {
    return <></>
  }
}
