
import CategoryPreview from "@/components/CategoryPreview";
import HomeHeader from "@/components/HomeHeader";
import SponsoredBanner from "@/components/SponsoredBanner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full min-h-full px-6">
      <HomeHeader />
      <SponsoredBanner />
      <section className="w-full mt-4">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[22px] font-raleway font-bold text-black">Categories</h3>
          <Link className="flex items-center gap-3" href='/'>
            <p className="text-[15px] font-raleway font-bold">See All</p>
            <button className="size-[30px] rounded-full bg-dark-blue flex items-center justify-center">
              <ArrowRight className="text-white size-[16px]" />
            </button>
          </Link>
        </div>
        <div className="w-full h-[660px] grid grid-cols-2 grid-rows-3 gap-1.5 mt-2">
          <CategoryPreview />
          <CategoryPreview />
          <CategoryPreview />
          <CategoryPreview />
          <CategoryPreview />
          <CategoryPreview />
        </div>
      </section>
    </section>
  );
}
