import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function InputSearch() {
  return (
    <div className="relative w-80">
      <SearchIcon className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3" size={24}/>
      
      <Input type="text" placeholder="Search Employee" className="pl-12 pr-4" />
    </div>
  );
}