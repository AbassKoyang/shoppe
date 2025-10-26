'use client';
import { useAuth } from '@/lib/contexts/auth-context';
import { defaultProfileAvatar } from '@/public/assets/images/exports';
import { useFetchProductPerUser } from '@/services/products/queries';
import { useFetchUserById } from '@/services/users/queries';
import { ArrowLeft, Calendar } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import JustForYouProductCard from '../JustForYouProductCard';
import { useRouter } from 'next/navigation';
import ProfileProductCardSkeleton from './ProfileProductCardSkeleton';

const VisitorProfile = ({userId}: {userId: string}) => {
    const {user} = useAuth();
    const {isError: iserror, isLoading: isloading, data} = useFetchUserById(userId);
    const {isError, isLoading, data: products} = useFetchProductPerUser(userId);
    const router = useRouter();

  return (
   <section className='w-full'>
    <div className="w-full mt-2">
        <button onClick={() => router.back()}>
            <ArrowLeft className='size-[25px]' />
        </button>
    </div>
    {data && products && (
         <div className="w-full">
         <div className="w-full flex justify-center items-center mt-3">
             <div className="size-[150px] rounded-full overflow-hidden border-3 border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] flex items-center justify-center">
                 <Image className='object-cover object-center' blurDataURL="/assets/images/default-profile-avatar.webp" alt="Profile picture" width={150} height={150} src={data?.profile.imageUrl ? data.profile.imageUrl : defaultProfileAvatar} />
             </div>
         </div>
         <div className="w-full flex items-center justify-center mt-1">
             <div className="flex flex-col items-center">
                 <h1 className='text-[18px] font-raleway font-bold text-[#202020]'>{data?.profile.name}</h1>
                 <div className="flex items-center gap-2 mt-1">
                     <Calendar className='size-[12px] text-black' />
                     <p className='font-nunito-sans text-black font-normal text-[12px]'>Member since {data?.createdAt.substring(0,10)}</p>
                 </div>
             </div>
         </div>
         <div className="w-full flex justify-between flex-wrap mt-1">
         {products && products.length > 0 && products.map((product) => (
         <JustForYouProductCard product={product} />
         ))}
         {products && products.length === 0  && (
         <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
             <h5 className='max-w-[300px] text-center text-[17px] font-semibold font-raleway'>This user has not listed anything yet</h5>
         </div>
         )}
         </div>
     </div>
    )}
    {isloading || isLoading && (
        <div className="w-full mt-3">
            <div className="w-full flex flex-col items-center justify-center">
                <div className="size-[150px] skeleton rounded-full"></div>
                <div className="w-[200px] h-8 rounded-[6px] skeleton mt-3"></div>
                <div className="w-[160px] h-4 rounded-[6px] skeleton mt-1"></div>
            </div>
            <ProfileProductCardSkeleton />
        </div>
    )}
    {iserror || isError && (
    <div className='w-full h-[60vh] flex items-center justify-center'>
        <p className='font-nunito-sans'>Oops, Failed to load orders.</p>
    </div>
    )}
   </section>
  )
}

export default VisitorProfile