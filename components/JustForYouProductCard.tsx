import React from 'react'

const JustForYouProductCard = () => {
  return (
        <button className='col-span-1 row-span-1 mb-1'>
            <div className="w-full h-[171px] p-1.5 rounded-[9px] bg-white object-contain object-center overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
                <img src="/assets/images/new-item-nike.png" alt="Product image" className="size-full rounded-[5px]"/>
            </div>
            <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5 text-left">$17,00</h5>
            <h6 className="text-black text-[14px] font-raleway font-bold mt text-left">NIKE AIR</h6>
            <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">Lorem ipsum dolor sit amet consectetur.</p>
            <p className="text-[9px] text-black/85 font-nunito-sans font-semibold  mt-0.5 text-left">Lagos, Nigeria</p>
         </button>
  )
}

export default JustForYouProductCard