import ArrowRightButton from "@/components/ArrowRightButton";
import CategoryPreview from "@/components/CategoryPreview";
import AgentButton from "@/components/home-page/AgentButton";
import JustForYou from "@/components/home-page/JustForYou";
import NewProducts from "@/components/home-page/NewProducts";
import PopularProducts from "@/components/home-page/PopularProducts";
import TopProducts from "@/components/home-page/TopProducts";
import HomeHeader from "@/components/HomeHeader";
import JustForYouProductCard from "@/components/JustForYouProductCard";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SponsoredBanner from "@/components/SponsoredBanner";
import TopProductAvatar from "@/components/TopProductAvatar";
import { useAuth } from "@/lib/contexts/auth-context";
import { Bot } from "lucide-react";
import Link from "next/link";

export default function Home() {

  return (
    <section className="w-full min-h-full px-4 [@media(min-width:375px)]:px-6 overflow-x-hidden">
      <HomeHeader />
      <SponsoredBanner />
      <section className="w-full mt-6">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-[#202020]">Categories</h3>
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-raleway font-bold text-[#202020">See All</p>
            <ArrowRightButton url={`/all-categories`} />
          </div>
        </div>
        <div className="w-full flex items-start justify-between flex-wrap mt-3">
          <CategoryPreview label="Dresses"  images={[]}/>
          <CategoryPreview label="Shoes"  images={[]}/>
          <CategoryPreview label="Bags"  images={[]}/>
          <CategoryPreview label="Underwears"  images={[]}/>
          <CategoryPreview label="Accessories"  images={[]}/>
          <CategoryPreview label="Outerwear"  images={[]}/>
        </div>
      </section>

      <TopProducts/>

      <NewProducts />

      <PopularProducts />

      <JustForYou />

      <AgentButton />

    </section>
  );
}
