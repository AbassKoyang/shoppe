
import ArrowRightButton from "@/components/ArrowRightButton";
import CategoryPreview from "@/components/CategoryPreview";
import HomeHeader from "@/components/HomeHeader";
import JustForYouProductCard from "@/components/JustForYouProductCard";
import ProductCard from "@/components/ProductCard";
import SponsoredBanner from "@/components/SponsoredBanner";
import TopProductAvatar from "@/components/TopProductAvatar";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden">
      <HomeHeader />
      <SponsoredBanner />
      <section className="w-full mt-6">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Categories</h3>
          <Link className="flex items-center gap-3" href='/'>
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton />
          </Link>
        </div>
        <div className="w-full h-[660px] grid grid-cols-2 grid-rows-3 gap-1.5 mt-3">
          <CategoryPreview label="Dresses"  images={[]}/>
          <CategoryPreview label="Shoes"  images={[]}/>
          <CategoryPreview label="Bags"  images={[]}/>
          <CategoryPreview label="Underwears"  images={[]}/>
          <CategoryPreview label="Accessories"  images={[]}/>
          <CategoryPreview label="Outerwear"  images={[]}/>
        </div>
      </section>

      <section className="w-full mt-8">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Top Products</h3>
          <div className="w-full flex items-center justify-between mt-2">
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
            <TopProductAvatar />
          </div>
      </section>

      <section className="w-full mt-8">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">New Items</h3>
          <Link className="flex items-center gap-3" href='/'>
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton />
          </Link>
        </div>

        <div className="min-w-full mt-2">
          <div className="w-full overflow-x-auto">
            <div className="w-[1000px] flex items-start gap-1.5">
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-8">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Most Popular</h3>
          <Link className="flex items-center gap-3" href='/'>
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton />
          </Link>
        </div>

        <div className="min-w-full mt-2">
          <div className="w-full overflow-x-auto">
            <div className="w-[1000px] flex items-start gap-1.5">
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
              <ProductCard/>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mt-8 mb-[300px]">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Just For You</h3>
          <Link className="flex items-center gap-3" href='/'>
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton />
          </Link>
        </div>

        <div className="w-full h-[880px] grid grid-cols-2 grid-rows-3 gap-1.5 mt-3">
              <JustForYouProductCard />
              <JustForYouProductCard />
              <JustForYouProductCard />
              <JustForYouProductCard />
              <JustForYouProductCard />
              <JustForYouProductCard />
        </div>
      </section>
    </section>
  );
}
