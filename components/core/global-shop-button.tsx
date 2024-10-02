import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useContext } from "react";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { ShoppingCart } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function GlobalShopButton() {
  const magicbox = useContext(MagicboxContext);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="outline" size="icon" className="overflow-hidden"> */}
        <div className="relative inline-block">
          <ShoppingCart className="w-5 h-5 text-gray-700" />
          {magicbox.basket.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {magicbox.basket.length}
            </span>
          )}
        </div>
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Basket</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {magicbox.basket.map((item, key) => (
          <DropdownMenuItem key={key}>
            <HoverCard>
              <HoverCardTrigger>Hover</HoverCardTrigger>
              {(item.data as string).substring(0, 40) + "..."}
              <HoverCardContent>
                The React Framework – created and maintained by @vercel.
              </HoverCardContent>
            </HoverCard>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <PlusIcon className="mr-2 h-4 w-4" />
          Request Access
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
