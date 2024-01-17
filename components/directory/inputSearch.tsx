import { Input } from "@/components/ui/input";

export default function InputSearch() {
  return (
    <div className="relative w-80">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-search absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Input type="text" placeholder="Search Employee" className="pl-12 pr-4" />
    </div>
  );
}