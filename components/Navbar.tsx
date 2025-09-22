'use client';
import { Heart, House, ListTree, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiCategoryAlt } from "react-icons/bi";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
  return (
    <nav className="w-full bg-white flex items-center justify-between px-6 py-4 fixed bottom-0 left-0 z-40">
        <Link href='/' className="p-2 flex flex-col items-center">
            <House className={`${pathname == '/' ? 'text-black' : 'text-dark-blue'} size-[35px] transition-colors duration-200 ease-in-out`} />
            <div className={`${pathname == '/' ? 'w-[14px]' : 'w-0'} h-[3px] rounded-xl bg-black transition-all duration-200 ease-in-out mt-2`}></div>
        </Link>
        <Link href='/' className="p-2 flex flex-col items-center">
            <Heart className={`${pathname.includes('wishlist') ? 'text-black' : 'text-dark-blue'} size-[35px] transition-colors duration-200 ease-in-out`} />
            <div className={`${pathname.includes('wishlist') ? 'w-[14px]' : 'w-0'} h-[3px] rounded-xl bg-black transition-all duration-200 ease-in-out mt-2`}></div>
        </Link>
        <Link href='/' className="p-2 flex flex-col items-center">
            <ShoppingBag className={`${pathname.includes('orders') ? 'text-black' : 'text-dark-blue'} size-[35px] transition-colors duration-200 ease-in-out`} />
            <div className={`${pathname.includes('orders') ? 'w-[14px]' : 'w-0'} h-[3px] rounded-xl bg-black transition-all duration-200 ease-in-out mt-2`}></div>
        </Link>
        <Link href='/' className="p-2 flex flex-col items-center">
            <User className={`${pathname.includes('profile') ? 'text-black' : 'text-dark-blue'} size-[35px] transition-colors duration-200 ease-in-out`} />
            <div className={`${pathname.includes('profile') ? 'w-[14px]' : 'w-0'} h-[3px] rounded-xl bg-black transition-all duration-200 ease-in-out mt-2`}></div>
        </Link>
    </nav>
  )
}

export default Navbar