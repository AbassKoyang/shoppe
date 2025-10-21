'use client'
import ArrowRightButton from '@/components/ArrowRightButton'
import JustForYouProductCard from '@/components/JustForYouProductCard'
import ProductCard from '@/components/ProductCard'
import ProfileProductCardSkeleton from '@/components/profile/ProfileProductCardSkeleton'
import UserHeader from '@/components/profile/UserHeader'
import RecentlyViewedProductCard from '@/components/recently-viewed/RecentlyViewedProductCard'
import TopProductAvatar from '@/components/TopProductAvatar'
import WishlistProductCard from '@/components/wishlist/WishlistProductCard'
import { useAuth } from '@/lib/contexts/auth-context'
import { getViewedOnSpecificDate, getViewedToday, getViewedYesterday } from '@/services/products/api'
import { useFetchUserWishlist, useGetViewedToday } from '@/services/products/queries'
import { recentlyViewedType } from '@/services/products/types'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsCheck } from 'react-icons/bs';
import { Calendar } from '@/components/ui/calendar'
import EmptyRecentlyViewed from '@/components/recently-viewed/EmptyRecentlyViewed'
import {motion} from 'framer-motion';

const page = () => {
  const {user} = useAuth();
  const [day, setDay] = useState<'today' | 'yesterday' | Date>('today');
  const [recViewed, setRecViewed] = useState<recentlyViewedType[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [isdateOpen, setIsdateOpen] = useState(false);
  const defaultDate = new Date(2025, 9, 10);
  useEffect(() => {
    const getRecentlyViewed = async () => {
      if(day === 'today'){
        setLoading(true);
        try {
          const recViewedToday = await getViewedToday(user?.uid || '');
          setRecViewed(recViewedToday);
          console.log('Reachedddd', recViewedToday);
          return
        } catch (error) {
          console.log(error);
          setIsError(true)
        } finally {
          setLoading(false);
        }
       
      };
      if(day === 'yesterday'){
        setLoading(true);
        try {
          const recViewedYesterday = await getViewedYesterday(user?.uid || '');
          setRecViewed(recViewedYesterday);
          return
        } catch (error) {
          console.log(error);
          setIsError(true)
        } finally {
          setLoading(false);
        }
       
      };

      try {
        const viewedOnSpecificDate = await getViewedOnSpecificDate(user?.uid || '', selectedDate || new Date());
        setRecViewed(viewedOnSpecificDate);
      } catch (error) {
        console.log(error);
        setIsError(true)
      } finally {
        setLoading(false);
      }

    }
    getRecentlyViewed();
  }, [day, user])

  useEffect(() => {
    if(selectedDate){
      setDay(selectedDate);
      console.log('reached:', selectedDate)
    }
  }, [selectedDate])
  

  return (
    <section className="w-full mt-2 relative overflow-x-hidden mb-[300px]">
      <motion.div
      initial={{y: '-150%'}}
      animate={{y: isdateOpen ? '0%' : '-150%'}}
      transition={{duration: 0.3, ease: 'easeInOut'}}
      className={`w-full fixed top-0 left-[50%] translate-x-[-50%] z-30`}>
        <div onClick={() => setIsdateOpen(false)} className="w-full h-dvh absolute top-0 left-0 bg-transparent"></div>
        <div className={`w-full flex justify-center mt-[60px]`}>
        <Calendar
            mode="single"
            defaultMonth={defaultDate}
            selected={selectedDate ? selectedDate : new Date()}
            onSelect={(date) => {
              setSelectedDate(date)
              setIsdateOpen(false);
            }}
            className="w-[335px] rounded-[25px] shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] bg-white z-40"
          />
          <button onClick={() => setIsdateOpen(false)} className='absolute bottom-[-15px] left-[50%] translate-x-[-50%] size-[30px] rounded-full bg-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] flex items-center justify-center z-50'>
          <ChevronUp className='text-dark-blue text-[12px]' />
          </button>
        </div>
      </motion.div>
        <h2 className='font-raleway font-bold text-[28px] tracking-[-0.28px]'>Recently Viewed</h2>
        <div className="w-full flex items-center justify-between mt-3">
          
          <button type='button' onClick={() => {setDay('today'); setSelectedDate(null)}} className={`${day === 'today' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[122px] w-[45%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
              <p className={`${day === 'today' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Today</p>
              <div className={`${day === 'today' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                  <BsCheck className="text-white" />
              </div>
            </button>
          {selectedDate ? (
              <button type='button' onClick={() => setDay(selectedDate)} className={`justify-end gap-3 cursor-pointer items-center min-w-[122px] w-[40%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
              <p className='font-bold text-dark-blue font-raleway text-[15px]'>{new Date(selectedDate).toDateString().slice(4,7)}, {new Date(selectedDate).getDate()}</p>
              <div className={`size-[22px] border-2 flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                  <BsCheck className="text-white" />
              </div>
          </button>
              ) : (<button type='button' onClick={() => setDay('yesterday')} className={`${day === 'yesterday' ? 'justify-end gap-3' : 'justify-center'} cursor-pointer items-center min-w-[122px] w-[40%] p-1 flex  bg-[#E5EBFC] rounded-[18px]`}>
              <p className={`${day === 'yesterday' ? 'font-bold text-dark-blue' : ' font-medium text-black'} font-raleway text-[15px]`}>Yesterday</p>
              <div className={`${day === 'yesterday' ? 'size-[22px] border-2' : 'size-0 border-0'} flex  border-white items-center justify-center bg-dark-blue rounded-full transition-all duration-300 ease-in-out origin-center`}>
                  <BsCheck className="text-white" />
              </div>
              </button>
            )}
          <button onClick={() => setIsdateOpen(true)}  className='size-[30px] rounded-full bg-dark-blue flex items-center justify-center'>
          <ChevronDown className='text-white text-[12px]' />
          </button>
        </div>  
        <div className="w-full mt-3 min-h-[60vh]">
            <div className="w-full flex justify-between flex-wrap">
            {recViewed && recViewed.length > 0 && loading === false && recViewed.map((recviewed) => (
              <RecentlyViewedProductCard key={recviewed.productId} product={recviewed.product} />
            ))}
            </div>
            {recViewed && recViewed.length === 0  && loading === false && (
              <EmptyRecentlyViewed />
            )}
            {isError && (
              <div className="w-full mt-6 flex flex-col items-center justify-center h-[50vh]">
              <p className='max-w-[280px] text-center text-[12px] font-normal font-nunito-sans text-black/80 mt-2'>Oops, failed to to load recently viewed items. </p>
              <button className='bg-dark-blue rounded-4xl px-4 py-2 text-white mt-4 cursor-pointer font-raleway'>Go back</button>
              </div>
            )}
            {loading && (
              <ProfileProductCardSkeleton />
            )}
        </div>
        <div className="w-full mt-8">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Most today</h3>
                <Link className="flex items-center gap-3" href='/'>
                    <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
                    <ArrowRightButton />
                </Link>
            </div>

            <div className="min-w-full mt-2">
            <div className="w-full overflow-x-auto flex items-start gap-1.5 carousel-container scrollbar-hide">
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
            </div>
        </div>
    </section>
  )
}

export default page