import {useEverythingStore} from "@/apps/everything/store";
import {EverythingModal} from "@/apps/everything/everything-modal";

export default function EverythingRoot() {
  const showModal = useEverythingStore((state) => state.showModal)
  const setShowModal = useEverythingStore((state) => state.setShowModal)

  return (
    <>
      {
        showModal && (
          <EverythingModal
            show={showModal}
            onClose={() => {
              setShowModal(false)
            }}
          />
        )
      }
    </>
  )
}
