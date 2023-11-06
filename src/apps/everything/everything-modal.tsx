import {useEffect, useMemo, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {SearchType, useEverythingStore} from "@/apps/everything/store";
import {cn} from "@/utils/cn";
import { ExternalLink, Search} from "lucide-react";
import {useNavigate} from "react-router-dom";


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

  const navigate = useNavigate();

  const close = () => {
    setOpen(false)
    setTimeout(onClose, 200)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          close()
        }
      }}
    >
      <DialogContent
        hideClose
        className="p-2 overflow-y-auto max-w-[650px]"
      >
        <DialogHeader className="space-y-0">
          <div className="flex border-gray-100 hover:text-gray-800 items-center mb-2">
            <Search className="text-gray-600 block ml-2" size={18} strokeWidth={1.5} />
            <input
              type="text"
              className="flex-1 block w-full outline-none p-2 placeholder:italic  placeholder:font-light"
              value={keyword}
              placeholder="Search everything..."
              onChange={(e) => {
                setInput({keyword: e.target.value})
              }}
            />
            <button
              className="mx-2 p-1 text-sm text-gray-400 hover:bg-accent outline-none transition-all rounded"
              onClick={() => {
                close()
                navigate('/everything/result')
              }}
              key="open-result"
            >
              <ExternalLink size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {types.map((t) => (
              <button
                className={
                  cn('px-2 py-0.5 text-sm font-medium text-gray-300 hover:bg-accent hover:text-gray-600 outline-none transition-all rounded', {
                    'text-gray-800 bg-accent': type === t.key,
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
          </div>

        </DialogHeader>

        <div className="h-[400px]">
        </div>
      </DialogContent>
    </Dialog>
  )
}
