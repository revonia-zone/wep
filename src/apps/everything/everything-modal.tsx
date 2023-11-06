import {useEffect, useMemo, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {SearchType, useEverythingStore} from "@/apps/everything/store";
import {cn} from "@/utils/cn";
import { ExternalLink, Search, X} from "lucide-react";


export function EverythingModal({show, onClose}: { show: boolean, onClose: () => void }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    show && setOpen(true)
  }, [show]);

  const {keyword, type, results, recentSearches, setInput} = useEverythingStore()


  const types = useMemo(() => {
    return [
      {key: SearchType.ALL, label: 'All'},
      {key: SearchType.BLOCK, label: 'Block'},
      {key: SearchType.PAGE, label: 'Page'},
      {key: SearchType.ACTION, label: 'Action'},
      {key: SearchType.AUTHOR, label: 'Author'},
      {key: SearchType.TAG, label: 'Tag'},
    ]
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOpen(false)
          setTimeout(onClose, 200)
        }
      }}
    >
      <DialogContent
        hideClose
        className="p-0 overflow-y-auto max-w-[650px]"
      >

        <DialogHeader className="space-y-0">
          <div className="flex items-center">
            {types.map((t) => (
              <button
                className={
                  cn('px-4 py-2 text-sm font-medium text-gray-400 hover:bg-accent outline-none transition-all', {
                    'text-blue-500': type === t.key,
                  })
                }
                onClick={() => {
                  setInput({type: t.key})
                }}
                key={t.key}
              >
                {t.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              className="mx-2 p-1 text-sm text-gray-400 hover:bg-accent outline-none transition-all rounded"
              onClick={() => {
              }}
              key="open-result"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </button>

            <button
              className="mx-2 p-1 text-sm text-gray-400 hover:bg-accent outline-none transition-all rounded"
              onClick={() => {
                setOpen(false)
                setTimeout(onClose, 200)
              }}
              key="hide"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex border-b border-t border-gray-100 hover:text-gray-800 items-center">
            <Search className="text-gray-600 block ml-2" size={18} strokeWidth={1.5} />
            <input
              type="text"
              className="flex-1 block w-full outline-none px-2 py-2 placeholder:italic placeholder:font-light text-sm"
              value={keyword}
              placeholder="Search everything..."
              onChange={(e) => {
                setInput({keyword: e.target.value})
              }}
            />
          </div>
        </DialogHeader>

        <div className="h-[400px]">
        </div>
      </DialogContent>
    </Dialog>
  )
}
