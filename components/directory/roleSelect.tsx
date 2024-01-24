import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";

export default function RoleSelect({
  data,
  onSelect,
  className,
}: {
  data: string[];
  onSelect: (value: string) => void;
  className: string;
}) {
  return (
    <Select onValueChange={(value) => onSelect(value)} >
      <SelectTrigger className={className} >
        <SelectValue
        placeholder="Select a Role"
        />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup >
          {data.map((item: any) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
