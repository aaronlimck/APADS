import { authConfig } from "@/auth.config";
import { getServerSession } from "next-auth";
import AvatarDropdown from "../avatar-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default async function NavBar() {
  const session = await getServerSession(authConfig);
  const userImage = session?.user.image;
  const userName = session?.user.name;

  return (
    <div className="h-14 w-full flex items-center justify-between bg-white border-b p-4">
      <div className="text-lg font-semibold select-none">APADS</div>

      <AvatarDropdown>
        <Avatar>
          <AvatarImage src={userImage!} />
          <AvatarFallback>{userName?.substring(0, 1)}</AvatarFallback>
        </Avatar>
      </AvatarDropdown>
    </div>
  );
}
