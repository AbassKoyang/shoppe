'use client';
import { useAuth } from "@/lib/contexts/auth-context";
import { CATEGORIES } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { RiChat3Line, RiHome6Line, RiSearch2Line, RiShoppingBag4Line, RiUserLine } from "react-icons/ri";
import ProtectedRoute from "./ProtectedRoute";
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';

const Navbar = () => {
    gsap.registerPlugin(useGSAP); 
    const pathname = usePathname();
    const params = useParams();
    const {user} = useAuth();
    const isHome = pathname == '/' || pathname.includes('sub-categories') || pathname.includes('categories') || pathname === '/most-popular-products' || pathname === '/new-products' || pathname === '/just-for-you'
    const router = useRouter();
    const navBarRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.from('.nav-animate', {
            y: 20,
            duration: 0.3, 
            ease: "power2.inOut" ,
            stagger: 0.1,
        })
        gsap.from('.gsap-animate', {
            y: 50,
            duration: 0.3, 
            ease: "power1.inOut" ,
            stagger: {
                each: 0.09,
                from: 'start',
                grid: 'auto',
                ease: 'power2.inOut',
            },
            delay: 1
        })
    }, {dependencies: [user, params], scope:navBarRef, revertOnUpdate: true })

    const hideNavbar = useMemo(() => {

        const sp = pathname.split('/');
        console.log(sp)
        const [slash, category] = sp;
        console.log(category);
        if(CATEGORIES.find((cat) => cat.value === category)){
            return true;
        }
}, [pathname])

if(hideNavbar) return null;
if(pathname == '/add-product') return null;
if(pathname.startsWith('/settings')) return null;
if(pathname.startsWith('/edit-product')) return null;
if(pathname.includes('/auth')) return null;
if(pathname.includes('/chat')) return null;
if(pathname.startsWith('/orders')) return null;
if(pathname.startsWith('/sales')) return null;
if(pathname.startsWith('/profile') && params?.userId !== user?.uid && pathname !== '/profile/notifications' ) return null;

    return (
        <ProtectedRoute>
        <nav ref={navBarRef} className="nav-animate overflow-hidden w-[calc(100%-32px)] [@media(min-width:375px)]:w-[calc(100%-48px)] bg-white flex items-center justify-between px-4 py-3 fixed bottom-3 left-[50%] translate-x-[-50%] z-100 rounded-[40px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <Link href='/' className={`gsap-animate px-3 py-2 rounded-4xl flex items-center ${isHome ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiHome6Line strokeWidth={1} className={`${isHome ? 'text-white bg-dark-blue size-[20px]' : 'text-black/75 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${isHome ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Home</p>
            </Link>
            <Link href='/search' className={`gsap-animate px-3 py-2 rounded-4xl flex items-center ${pathname.includes('search') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiSearch2Line strokeWidth={1} className={`${pathname.includes('search') ? 'text-white bg-dark-blue size-[20px]' : 'text-black/75 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('search') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Search</p>
            </Link>
            <Link href='/inbox' className={`gsap-animate px-3 py-2 rounded-4xl flex items-center ${pathname.includes('inbox') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiChat3Line strokeWidth={1} className={`${pathname.includes('inbox') ? 'text-white bg-dark-blue size-[20px]' : 'text-black/75 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('inbox') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Inbox</p>
            </Link>
            <Link href={`/profile/${user?.uid}`} className={`gsap-animate px-3 py-2 rounded-4xl flex items-center ${pathname.includes('profile') || pathname.startsWith('/wishlist') || pathname.startsWith('/settings') || pathname.includes('/recently-viewed') ? 'bg-dark-blue' : 'bg-transparent'}`}>
                <RiUserLine strokeWidth={1} className={`${pathname.includes('profile') || pathname.startsWith('/wishlist') || pathname.startsWith('/settings') || pathname.includes('/recently-viewed')  ? 'text-white bg-dark-blue size-[20px]' : 'text-black/75 bg-white size-[24px]'} z-20 transition-transform duration-300 ease-in-out`} />
                <p className={`${pathname.includes('profile') || pathname.startsWith('/wishlist') || pathname.startsWith('/settings') || pathname.includes('/recently-viewed') ? 'translate-x-0 opacity-100 w-auto ml-1' : '-translate-x-5 opacity-0 w-0 ml-0'} transition-all duration-300 ease-in-out text-[12px] font-nunito-sans text-white font-normal z-10`}>Profile</p>
            </Link>
        </nav>
    </ProtectedRoute>
    )
}

export default Navbar