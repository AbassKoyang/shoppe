import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full min-h-full px-6">
      <header className="w-full flex items-center justify-between py-4">
        <h3 className="font-bold font-raleway text-[30px]">Shop</h3>
        <div className="w-[250px] h-[36px] rounded-2xl bg-[#F8F8F8] flex items-center justify-between overflow-hidden">
          <input type="text" placeholder="Search" className="h-full w-[80%] pl-4 bg-transparent placeholder:text-[#C7C7C7]" />
          <button className="flex items-center justify-center mr-2">
            <Search strokeWidth={1} className="size-[19px] text-dark-blue" />
          </button>
        </div>
      </header>
      <section className="w-full h-[140px] rounded-lg bg-[#f1b11c]">

      </section>
    </section>
  );
}
