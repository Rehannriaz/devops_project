import Link from "next/link";
import { useRouter } from "next/navigation";
import { userService } from "../app/api/userService"; // Adjust this import path as needed
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await userService.logout();
      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex bg-[#841bfd] p-3 justify-between items-center px-8">
        <div>
          <Link href="/notes" className="text-white font-bold text-[28px]">
            NotesMaster
          </Link>
        </div>
        <div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="text-white font-medium text-[18px] py-2 hover:text-gray-300 hover:border-b hover:border-gray-300">
            {isLoading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
