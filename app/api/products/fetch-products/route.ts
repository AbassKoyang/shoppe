import {NextResponse, NextRequest} from  'next/server';
import {algoliasearch, SearchResponse} from 'algoliasearch';

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_WRITE_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY!;
const ALGOLIA_SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!;
const ALGOLIA_INDEX_NAME = "products"; // your Algolia index name

// const client = algoliasearch();
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // ✅ Collect filters
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const currency = searchParams.get("currency");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const discountPercentage = searchParams.get("discountPercentage");
  const size = searchParams.getAll("size")[0]?.split(','); // array
  const gender = searchParams.get("gender");
  const condition = searchParams.get("condition");
  const order = searchParams.get("order"); // Popular | Newest | Oldest

 // 🔹 facetFilters (categorical filters)
 const facetFilters: string[][] = [];
 if (location) facetFilters.push([`location:${location}`]);
 if (category) facetFilters.push([`category:${category}`]);
 if (currency) facetFilters.push([`currency:${currency}`]);
 if (gender) facetFilters.push([`gender:${gender}`]);
 if (condition) facetFilters.push([`condition:${condition}`]);
 
 if (size) {
    const formatSizes = (sizes: string[]) => {
    return sizes.map((s) => `size:${s}`)
    } 
    const formattedSizes = formatSizes(size);
    facetFilters.push(formattedSizes)
}
  

 // 🔹 numericFilters
 const numericFilters: string[][] = [];
 if (minPrice) numericFilters.push([`price>=${minPrice}`]);
 if (maxPrice) numericFilters.push([`price<=${maxPrice}`]);
 if (discountPercentage) numericFilters.push([`discountPercentage>=${discountPercentage}`]);
 // 🔹 sort by order
 let sortBy: string | undefined;
 if (order === "Newest") sortBy = "createdAt_desc";
 if (order === "Oldest") sortBy = "createdAt_asc";
 if (order === "Popular") sortBy = "popular_desc";

  try {
    const res = await client.search({
        requests: [
          {
            indexName: sortBy ? `${ALGOLIA_INDEX_NAME}_${sortBy}` : ALGOLIA_INDEX_NAME,
            facetFilters,
            numericFilters,
          },
        ],
      });
    const searchResult = res.results[0] as SearchResponse<any>;
    console.log(searchResult, searchResult.hits)
    return NextResponse.json(searchResult.hits);
  } catch (err: any) {
    console.error("❌ Algolia fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
