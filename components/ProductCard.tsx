import { formatDescription, formatPrice, formatProductCardImageUrl, formatProductLink, formatTitle } from "@/lib/utils";
import { ProductType } from "@/services/products/types"
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({product} : {product: any}) => {
  const price : string = String(product.price);

  const imageUrl = formatProductCardImageUrl(product.image || product.images[0], {
    width: '300',
    height: '300',
    c_fill: true,
    g_auto: true,
    q_auto: true,
    f_auto: true,
    e_sharpen: true,
    dpr_auto: true,
  })

  const formattedPrice = formatPrice(price, product.currency || '');

  const title = formatTitle(product.title);
  
  const desc = formatDescription(product.description, 18);

  const productLink = formatProductLink(product.category, product.subCategory, product.objectID || product.id);

  return (
    <Link href={productLink} className="w-[140px] shrink-0 product-card first:ml-0.5">
        <div className="w-full h-[140px] p-1.5 rounded-[9px] bg-white object-contain object-center overflow-hidden shadow-[0_5px_10px_0_rgba(0,0,0,0.12)]">
            <Image
            src={imageUrl}
            width={300}
            height={300}
            style={{ width: "128px", height: "128px" }}
          placeholder="blur"
          blurDataURL="/assets/images/product-fallback-image.png"
          alt={product.title}
            sizes="(max-width: 768px) 100px, 128px"
            className="rounded-[5px] object-cover"/>
        </div>
        <h5 className="text-black text-[17px] font-raleway font-bold mt-1.5">{formattedPrice}</h5>
        <h6 className="text-black text-[14px] font-raleway font-bold mt">{title}</h6>
        <p className="text-black text-[12px] font-nunito-sans font-normal max-w-full text-left mt">{desc}</p>
        <div className="w-full max-w-full flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
          <MapPin className='text-black/85 size-[10px]' />
          <p className="text-[9px] text-black/85 font-nunito-sans font-semibold text-left max-w-fit">{product.location}</p>
          </div>
          <span className='text-black/85 text-[12px] mr-2'>-{product.discount}%</span>
        </div>
    </Link>
  )
}

export default ProductCard