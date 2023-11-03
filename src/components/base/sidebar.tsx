import UserCard from "./user-card";
import PageTreeViewer from "./page-tree-viewer";
import NetworkCard from "./network-card";

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-r-gray-100 flex flex-col">
      <UserCard />
      <PageTreeViewer />
      <NetworkCard />
    </div>
  )
}
