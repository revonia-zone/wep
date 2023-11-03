import {Button} from "@/components/ui/button";
import UserAvatar from "@/components/base/user-avatar";
import {useUserStore} from "@/stores/user-store";
import {useNavigate} from "react-router-dom";

export default function UserCard() {
  const userStore = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="px-2 py-1 h-12 flex bg-white">
      <Button variant="ghost" className="w-full h-full py-1" onClick={() => navigate('/user')}>
        <div className="flex w-full">
          <UserAvatar className="w-8 h-8" />
          <span className="flex-1 leading-8 px-2 text-left">
            {userStore.users[userStore.currentUserIndex]?.username}
          </span>
        </div>
      </Button>
    </div>
  )
}
