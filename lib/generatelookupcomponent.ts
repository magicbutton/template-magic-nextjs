export function generateLookup(
  databaseName: string,
  tableName: string
): string {
  const x = `import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface LookupProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Lookup: React.FC<LookupProps> = ({ id, name, value, onChange }) => {
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleValueSelect = (value: string) => {
    setSelectedValue(value);
    onChange({ target: { name, value, type: "text" } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input id={id} name={name} value={selectedValue} onChange={onChange} required />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Lookup</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Input
            id="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
          <div className="mt-2">
            {/* Example list of values, replace with actual search results */}
            {["value1", "value2", "value3"].map((val) => (
              <div
                key={val}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleValueSelect(val)}
              >
                {val}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Lookup;
`;
  return x;
}
