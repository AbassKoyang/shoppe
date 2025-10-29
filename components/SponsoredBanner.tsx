'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import { Button } from './ui/button';
import Link from 'next/link';

const SponsoredBanner = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );
    
  
    useEffect(() => {
      if (!api) return;
      const snaps = api.scrollSnapList().length;
      setCount(snaps);
      setCurrent(api.selectedScrollSnap());
  
      api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
      });
    }, [api]);
  
    const scrollTo = (index: number) => {
      api?.scrollTo(index);
    };

  return (
        <>
        <Carousel setApi={setApi} opts={{ loop: true }} plugins={[plugin.current]} className='w-full rounded-lg'> 
            <CarouselContent className='rounded-lg'>
               <CarouselItem className='w-full h-[140px] bg-transparent rounded-lg'>
                <div className="size-full rounded-lg overflow-hidden">
                    <div className="size-full p-3 flex items-center justify-between relative bg-dark-blue object-contain overflow-hidden">
                        <div className="w-[70%] z-20 flex flex-col items-start justify-between h-full">
                        <p className="text-[24px] text-white font-raleway font-bold max-w-full leading-6">Discover the Hottest Deals</p>
                        <p className="text-[10px] font-nunito-sans font-normal text-white mt-1 mx-w-full">Step up your style game — find trending shoes, bags, and outfits at student-friendly prices.</p>
                        <Link href='/all-categories' className="w-fit py-1 px-3 rounded-4xl bg-white text-[10px] text-black font-raleway font-semibold z-20">Shop Now →</Link>
                        </div> 

                        <img className='z-20 w-[150px] absolute bottom-0 right-[-10px] rotate-[30deg]' src="/assets/images/banner-shoe.png" alt="Shoe" />
                        {/* bubbles */}
                        <svg className="absolute bottom-0 left-0 z-10" width="118" height="54" viewBox="0 0 118 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.9" d="M-17.7663 80.3065C-66.6736 56.1107 0.465898 7.82151 37.5692 1.27921C74.6724 -5.2631 110.054 19.5115 116.596 56.6147C123.139 93.718 98.3642 129.1 61.2609 135.642C24.1577 142.184 31.141 104.502 -17.7663 80.3065Z" fill="#0950f6"/>
                        </svg>

                        <svg className="absolute bottom-0 right-0 z-10"  width="61" height="130" viewBox="0 0 61 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M196.705 54.6528C273.822 82.0108 186.344 168.648 133.457 185.832C80.5704 203.016 23.1404 172.146 5.18398 116.882C-12.7725 61.6174 24.2982 20.8995 71.2044 1.21146C118.111 -18.4765 119.588 27.2947 196.705 54.6528Z" fill="#0234a9"/>
                        </svg>

                        <svg className="absolute bottom-0 right-0 z-20" width="69" height="76" viewBox="0 0 69 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M68.7817 14.148C101.103 -29.8148 137 44.6901 137 82.3658C137 120.041 106.457 150.584 68.7817 150.584C31.1061 150.584 0.563965 120.041 0.563965 82.3658C0.563965 44.6901 36.4609 58.1107 68.7817 14.148Z" fill="#0950f6"/>
                        </svg>
                    </div>
                </div>
               </CarouselItem>

            </CarouselContent>
        </Carousel>

        <div className="w-full flex items-center justify-center gap-2 mt-3">
            {Array.from({ length: count }).map((_, idx) => (
                <Button
                    key={idx}
                    size="icon"
                    className={`transition-all duration-100 ease-in-out hover:bg-dark-blue ${
                    current === idx ? "bg-dark-blue h-2.5 w-10 rounded-xl" : "bg-light-blue size-2.5 rounded-full"
                    }`}
                    onClick={() => scrollTo(idx)}
                />
             ))}
        </div>
        </>
  )
}

export default SponsoredBanner