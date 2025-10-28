'use client';
import { formatProductCardImageUrl, formatProductLink } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link";

const TopProductAvatar = ({product}:{product: any}) => {
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
  const productLink = formatProductLink(product.category, product.subCategory, product.objectID || product.id);

  return (
    <Link href={productLink} className="size-[60px] border-5 border-white shadow-[0_5px_10px_0_rgba(0,0,0,0.12)] rounded-full object-contain object-center overflow-hidden">
        <Image
        src={imageUrl}
        width={300}
        height={300}
        style={{ width: "50px", height: "50px" }}
      placeholder="blur"
      blurDataURL="/assets/images/product-fallback-image.png"
      alt={product.title}
        sizes="(max-width: 768px) 100px, 50px"
        className="rounded-[5px] object-cover"/>
     </Link>
  )
}

export default TopProductAvatar