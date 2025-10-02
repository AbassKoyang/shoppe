
const ProductCard = () => {
  return (
    <div className="w-[140px] shrink-0 product-card first:ml-0.5">
        <div className="w-full h-[140px] p-1.5 rounded-[9px] bg-white object-contain object-center overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <img src="/assets/images/new-item-nike.png" alt="Product image" className="size-full rounded-[5px]"/>
        </div>
        <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5">$17,00</h5>
        <h6 className="text-black text-[14px] font-raleway font-bold mt">NIKE AIR</h6>
        <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">Lorem ipsum dolor sit amet consectetur.</p>
        <p className="text-[9px] text-black/85 font-nunito-sans font-semibold  mt-0.5">Lagos, Nigeria</p>
    </div>
  )
}

export default ProductCard