'use client';
import React, { useEffect, useState } from 'react'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Image from 'next/image'
import { welcomeBubble, welcomeImage1, welcomeImage2 } from '@/public/assets/images/exports'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const page = () => {
    const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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
    <section className='w-full h-dvh overflow-x-hidden flex items-center justify-center relative'>
        <Image src={welcomeBubble} alt='bubble' className='top-0 left-0 absolute' />
       <div className='w-[90%] h-[90%]'>
       <Carousel setApi={setApi} opts={{ loop: true }} className='shadow-slate-300 shadow-xl rounded-3xl'>
        <CarouselContent>
            <CarouselItem className='flex items-center justify-center h-[600px] rounded-3xl'>
                <div className='w-full h-[100%] flex-col items-center justify-between bg-white rounded-3xl overflow-hidden '>
                    <div className='w-full h-[50%] object-contain overflow-hidden object-center'>
                        <Image src={welcomeImage1} alt='welcome image' className='size-full' />
                    </div>
                    <div className='w-full h-[50%] bg-white flex flex-col items-center justify-center px-8'>
                        <h3 className='font-bold text-4xl text-[#202020] text-center'>Hello!</h3>
                        <p className='text-black text-xl font-light mt-3 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non consectetur turpis. Morbi eu eleifend lacus.</p>
                    </div>
                </div>
            </CarouselItem>
            <CarouselItem className='flex items-center justify-center h-[600px] rounded-3xl'>
                <div className='w-full h-[100%] flex-col items-center justify-between bg-white rounded-3xl overflow-hidden '>
                    <div className='w-full h-[50%] object-contain overflow-hidden object-center'>
                        <Image src={welcomeImage2} alt='welcome image' className='size-full' />
                    </div>
                    <div className='w-full h-[50%] bg-white flex flex-col items-center justify-center px-8'>
                        <h3 className='font-bold text-4xl text-[#202020] text-center'>Welcome!</h3>
                        <p className='text-black text-xl font-light mt-3 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non consectetur turpis. Morbi eu eleifend lacus.</p>
                    </div>
                </div>
            </CarouselItem>
            <CarouselItem className='flex items-center justify-center h-[600px] rounded-3xl'>
                <div className='w-full h-[100%] flex-col items-center justify-between bg-white rounded-3xl overflow-hidden '>
                    <div className='w-full h-[50%] object-contain overflow-hidden object-center'>
                        <Image src={welcomeImage1} alt='welcome image' className='size-full' />
                    </div>
                    <div className='w-full h-[50%] bg-white flex flex-col items-center justify-center px-8'>
                        <h3 className='font-bold text-4xl text-[#202020] text-center'>Ready?</h3>
                        <p className='text-black text-xl font-light mt-3 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <Link className='cursor-pointer bg-dark-blue hover:opacity-90 transition-all duration-200 ease-in-out text-[#F3F3F3] text-[22px] font-extralight flex items-center justify-center rounded-xl px-18 py-3 mt-5' href='/home'>Let's Start</Link>
                    </div>
                </div>
            </CarouselItem>
        </CarouselContent>
        </Carousel>
        <div className="flex justify-center mt-4 space-x-4">
            {Array.from({ length: count }).map((_, idx) => (
            <Button
                key={idx}
                size="icon"
                className={`size-5 rounded-full hover:bg-dark-blue ${
                current === idx ? "bg-dark-blue" : "bg-light-blue"
                }`}
                onClick={() => scrollTo(idx)}
            />
            ))}
        </div>
       </div>
    </section>
)
}

export default page