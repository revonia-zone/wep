import PageTitle from "@/components/base/header/page-title";
import {User} from "lucide-react";

export default function UserPage() {
  return (
    <div>
      <PageTitle
        text="User"
        icon={User}
      />
    </div>
  )
}
