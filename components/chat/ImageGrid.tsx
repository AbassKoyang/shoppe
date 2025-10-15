import { useAuth } from '@/lib/contexts/auth-context';
import React from 'react'

const ImageGrid = ({images, senderId}: {images: string[]; senderId: string}) => {
    const {user} = useAuth();
    if(images.length === 0) return null;
    if(images.length === 1) return (
        <div className={`size-[200px] object-center rounded-4xl border-2 overflow-hidden`}>
            <img src={images[0]} className='object-cover object-center size-full' />
        </div>
    );
    if(images.length === 2) return (
        <div className={`size-[200px] object-center flex items-center`}>
            <div className={`overflow-hidden w-[50%] h-[100%] border-r-1 ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"} object-center object-cover rounded-tl-4xl rounded-bl-4xl`}>
             <img src={images[0]} className='object-cover object-center size-full' />
            </div>
            <div className={`overflow-hidden w-[50%] h-[100%] border-l-1 ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"} object-center object-cover rounded-tr-4xl rounded-br-4xl`}>
             <img src={images[1]} className='object-cover object-center size-full' />
            </div>
        </div>
    );
    if(images.length === 3) return (
        <div className={`size-[200px] object-center flex items-center`}>
            <div className={`overflow-hidden w-[50%] h-[100%] border-r-1 rounded-tl-4xl rounded-bl-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"} object-center object-cover`}>
             <img src={images[0]} className='object-cover object-center size-full' />
            </div>
            <div className={`w-[50%] h-[100%]`}>
                <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-b-1 rounded-tr-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
                 <img src={images[1]} className='object-cover object-center size-full' />
                </div>
                <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-t-1 rounded-br-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
                 <img src={images[2]} className='object-cover object-center size-full' />
                </div>
            </div>
        </div>
    );
  return (
    <div className={`size-[200px] object-center rounded-4xl flex items-center`}>
        <div className="w-[50%] h-[100%]">
            <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-r-1 border-b-1 rounded-tl-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
            <img src={images[0]} className='object-cover' />
            </div>
            <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-r-1  border-t-1 rounded-bl-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
            <img src={images[2]} className='object-cover' />
            </div>
        </div>
        <div className="w-[50%] h-[100%]">
            <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-l-1 border-b-1 rounded-tr-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
            <img src={images[2]} className='object-cover' />
            </div>
            <div className={`overflow-hidden w-[100%] h-[50%] object-center object-cover border-l-1  border-t-1 rounded-br-4xl ${senderId === user?.uid ? "border-dark-blue" : "border-[#ebeffaed]"}`}>
            <img src={images[3]} className='object-cover' />
            </div>
        </div>
    </div> 
  )
}

export default ImageGrid
