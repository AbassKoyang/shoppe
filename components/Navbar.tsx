'use client';
import { Heart, House, ListTree, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiCategoryAlt } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { RiHome6Line, RiSearch2Line, RiShoppingBag4Line, RiUserLine } from "react-icons/ri";

const Navbar = () => {
    const pathname = usePathname();
    const isProductPage = /^\/[^/]+\/[^/]+\/[^/]+$/.test(pathname);
    const router = useRouter();

        if (isProductPage) return null
    return (
        <nav className="w-[calc(100%-32px)] [@media(min-width:375px)]:w-[calc(100%-48px)] bg-white flex items-center justify-between px-4 py-3 fixed bottom-3 left-[50%] translate-x-[-50%] z-30 rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <Link href='/' className={`px-3 py-2 rounded-4xl flex items-center ${pathname == '/' ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiHome6Line strokeWidth={1} className={`${pathname == '/' ? 'text-white bg-dark-blue size-[20px]' : 'text-black/80 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname == '/' ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Home</p>
            </Link>
            <Link href='/orders' className={`px-3 py-2 rounded-4xl flex items-center ${pathname.includes('orders') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiShoppingBag4Line strokeWidth={1} className={`${pathname.includes('orders') ? 'text-white bg-dark-blue size-[20px]' : 'text-black/80 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('orders') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Orders</p>
            </Link>
            <Link href='/search' className={`px-3 py-2 rounded-4xl flex items-center ${pathname.includes('search') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiSearch2Line strokeWidth={1} className={`${pathname.includes('search') ? 'text-white bg-dark-blue size-[20px]' : 'text-black/80 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('search') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Search</p>
            </Link>
            <Link href='/profile' className={`px-3 py-2 rounded-4xl flex items-center ${pathname.includes('profile') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiUserLine strokeWidth={1} className={`${pathname.includes('profile') ? 'text-white bg-dark-blue size-[20px]' : 'text-black/80 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('profile') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Profile</p>
            </Link>
        </nav>
    )
}

export default Navbar