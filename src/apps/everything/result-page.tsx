import PageTitle from "@/components/base/header/page-title";
import {Search} from "lucide-react";

export default function EverythingResultPage() {
  return (
    <div>
      <PageTitle text="Search Result" icon={Search}/>
      <h1>Search Result</h1>
    </div>
  )
}
