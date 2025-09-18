
const ProductCard = () => {
  return (
    <div className="w-[140px]">
        <div className="w-full h-[140px] p-1.5 rounded-md bg-white object-contain object-center overflow-hidden shadow-sm">
            <img src="/assets/images/clothing-3.png" alt="Product image" className="size-full rounded-md"/>
        </div>
        <h6 className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt-1.5">Lorem ipsum dolor sit amet consectetur.</h6>
        <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5">$17,00</h5>
    </div>
  )
}

export default ProductCard