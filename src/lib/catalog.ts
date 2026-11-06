export type GarmentColor = { name: string; garment: string; ink: string };

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  tagline: string;
  description: string;
  priceCents: number;
  compareAtCents?: number;
  category: "men" | "women" | "accessories";
  categoryLabel: string;
  gender: "men" | "women" | "accessories";
  collections: string[];
  colors: GarmentColor[];
  sizes: string[];
  badge?: string;
  printStyle: "block" | "script" | "varsity" | "minimal" | "outline";
  printLines: string[];
  image: string;
  images: string[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  fabric: string;
  fit: string;
};

type RawProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  description: string;
  category: Product["category"];
  images: string[];
  sizes: string[];
  stock: number;
  isNew?: boolean;
  featured?: boolean;
};

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const AS_SHOWN = [{ name: "As shown", garment: "#ffffff", ink: "#111111" }];
const ARCHIVE_CODES = new Set(["IS90-004", "IS90-005", "IS90-014", "IS90-016", "IS90-017", "IS90-019", "IS90-020", "IS90-021"]);
/**
 * Official imagery is served by the live brand site (a Next.js app that hosts
 * its files under /images/...). We hotlink those files so the redesign shows
 * the real product photography without shipping binary assets in this repo.
 */
export const OFFICIAL_SITE_URL = "https://www.inkotanyisince90.com";
export const officialImage = (file: string) => `${OFFICIAL_SITE_URL}/images/${file}`;
const img = (file: string) => officialImage(file);

/**
 * Exact catalogue data and official imagery from inkotanyisince90.com.
 * Prices are Rwandan francs; priceCents stores RWF x 100 for existing order math.
 */
const RAW_PRODUCTS: RawProduct[] = [
  { id: "1", slug: "inkotanyi-script", sku: "IS90-001", name: "INKOTANYI SCRIPT", price: 18000, description: "Clean white tee with signature Inkotanyi script on the chest. Understated and refined.", category: "men", images: ["ink.front-removebg-preview.png", "ink.back-removebg-preview.png", "ink.front-removebg-preview.model.png", "ink.back-removebg-preview.model.png"], sizes: SIZES, stock: 50, isNew: true, featured: true },
  { id: "2", slug: "inkotanyi-athlete", sku: "IS90-002", name: "INKOTANYI ATHLETE", price: 18000, description: "Athletic version of the classic Inkotanyi script. Performance-ready design.", category: "men", images: ["ink.athlete.front-removebg-preview.png", "ink.athlete.back-removebg-preview.png", "ink.athlete.front-removebg-preview.model.png", "ink.athlete.back-removebg-preview.model.png"], sizes: SIZES, stock: 40, isNew: true, featured: true },
  { id: "3", slug: "inkotanyi-women", sku: "IS90-003", name: "INKOTANYI WOMEN", price: 10000, description: "Women's cut with the iconic Inkotanyi script. Elegant and powerful.", category: "women", images: ["ink.women.front-removebg-preview.png", "ink.women.back-removebg-preview.png", "ink.women.front-removebg-preview.model.png", "ink.women.back-removebg-preview.model.png"], sizes: SIZES, stock: 35, isNew: true, featured: true },
  { id: "4", slug: "since-90", sku: "IS90-004", name: "SINCE 90", price: 18000, description: "Bold heritage graphic on white cotton. A statement piece rooted in 1990.", category: "men", images: ["1990.front-removebg.png", "1990.back-removebg-preview.png", "1990.front-removebg.model.png", "1990.back-removebg-preview.model.png"], sizes: SIZES, stock: 75, isNew: true, featured: true },
  { id: "5", slug: "urugwiro", sku: "IS90-005", name: "URUGWIRO", price: 18000, description: "Black tee featuring the iconic Inkotanyi collective graphic. Timeless streetwear.", category: "men", images: ["urugwiro.front-removebg-preview.png", "urugwiro.back-removebg-preview.png", "urugwiro.front-removebg-preview.model.png", "urugwiro.back-removebg-preview.model.png"], sizes: SIZES, stock: 40, featured: true },
  { id: "6", slug: "i-feel-like-inkotanyi", sku: "IS90-006", name: "I FEEL LIKE INKOTANYI", price: 18000, description: "Black letter chest print. Confidence in every wear.", category: "men", images: ["ifeel.front-removebg-preview.png", "ifeel.back-removebg-preview.png", "ifeel.front-removebg-preview.model.png", "ifeel.back-removebg-preview.model.png"], sizes: SIZES, stock: 30, isNew: true, featured: true },
  { id: "7", slug: "inko-women", sku: "IS90-007", name: "INKO WOMEN", price: 10000, description: "Elegant women's tee with modern design. Perfect for everyday wear.", category: "women", images: ["iink.w.front-removebg-preview.png", "iink.w.back-removebg-preview.png", "iink.w.front-removebg-preview.model.png", "iink.w.back-removebg-preview.model.png"], sizes: SIZES, stock: 35, isNew: true },
  { id: "8", slug: "island", sku: "IS90-008", name: "ISLAND", price: 18000, description: "Premium island-inspired design. Stand out from the crowd.", category: "men", images: ["island.front-removebg-preview.png", "island.back-removebg-preview.png", "island.front-removebg-preview.model.png", "island.back-removebg-preview.model.png"], sizes: SIZES, stock: 25, isNew: true },
  { id: "9", slug: "inkotanyi-legacy", sku: "IS90-009", name: "INKOTANYI LEGACY", price: 18000, description: "Legacy edition with classic Inkotanyi design. Timeless appeal.", category: "men", images: ["ink.legacy.front-removebg-preview.png", "ink.legacy.back-removebg-preview.png", "ink.legacy.front-removebg-preview.model.png", "ink.legacy.back-removebg-preview.model.png"], sizes: SIZES, stock: 45, isNew: true, featured: true },
  { id: "10", slug: "inkotanyi-sl", sku: "IS90-010", name: "INKOTANYI SL", price: 23000, description: "Street lifestyle edition. Urban meets heritage.", category: "men", images: ["ink.sl.front-removebg-preview.png", "ink.sl.back-removebg-preview.png", "ink.sl.front-removebg-preview.model.png", "ink.sl.back-removebg-preview.back.model.png"], sizes: SIZES, stock: 40, isNew: true },
  { id: "11", slug: "am", sku: "IS90-011", name: "AM", price: 18000, description: "Bold statement piece. Stand out with confidence.", category: "men", images: ["am.front-removebg-preview.png", "am.back-removebg-preview.png", "am.front-removebg-preview.model.png", "am.back-removebg-preview.model.png"], sizes: SIZES, stock: 30, isNew: true },
  { id: "12", slug: "iam", sku: "IS90-012", name: "IAM", price: 18000, description: "Premium design with powerful messaging. Be yourself.", category: "men", images: ["iam.front-removebg-preview.png", "iam.back-removebg-preview.png", "iam.front-removebg-preview.model.png", "iam.back-removebg-preview.model.png"], sizes: SIZES, stock: 35, isNew: true, featured: true },
  { id: "13", slug: "really", sku: "IS90-013", name: "REALLY", price: 18000, description: "Bold statement design. Express yourself.", category: "men", images: ["really.front-removebg-preview.png", "really.back-removebg-preview.png", "really.front-removebg-preview.model.png", "really.back-removebg-preview.model.png"], sizes: SIZES, stock: 30, isNew: true },
  { id: "14", slug: "bsl", sku: "IS90-014", name: "BSL", price: 23000, description: "Modern streetwear design with clean aesthetics.", category: "men", images: ["bsl.front-removebg-preview.png", "bsl.back-removebg-preview.png", "bsl.front-removebg-preview.model.png", "bsl.back-removebg-preview.model.png"], sizes: SIZES, stock: 35, isNew: true },
  { id: "15", slug: "ink-gallery", sku: "IS90-015", name: "INK GALLERY", price: 18000, description: "Gallery edition featuring artistic Inkotanyi design.", category: "men", images: ["inkgallery.front-removebg-preview.png", "inkgallery.back-removebg-preview.png", "inkgallery.front-removebg-preview.model.png", "inkgallery.back-removebg-preview.model.png"], sizes: SIZES, stock: 40, isNew: true },
  { id: "16", slug: "ink-legacy", sku: "IS90-016", name: "INK LEGACY", price: 18000, description: "Legacy collection with classic design elements.", category: "men", images: ["inkleg.front-removebg-preview.png", "inkleg.back-removebg-preview.png", "inkleg.front-removebg-preview.model.png", "inkleg.back-removebg-preview.model.png"], sizes: SIZES, stock: 45, isNew: true },
  { id: "17", slug: "legacy", sku: "IS90-017", name: "LEGACY", price: 18000, description: "Timeless design representing heritage and tradition.", category: "men", images: ["leg.front-removebg-preview.png", "leg.back-removebg-preview.png", "leg.front-removebg-preview.model.png", "leg.back-removebg-preview.model.png"], sizes: SIZES, stock: 38, isNew: true },
  { id: "18", slug: "many", sku: "IS90-018", name: "MANY", price: 18000, description: "Bold statement piece for those who stand out.", category: "men", images: ["many.front-removebg-preview.png", "many.back-removebg-preview.png", "many.front-removebg-preview.model.png", "many.back-removebg-preview.model.png"], sizes: SIZES, stock: 32, isNew: true },
  { id: "19", slug: "save", sku: "IS90-019", name: "SAVE", price: 18000, description: "Premium design with meaningful message.", category: "men", images: ["save.front-removebg-preview.png", "save.back-removebg-preview.png", "save.front-removebg-preview.model.png", "save.back-removebg-preview.model.png"], sizes: SIZES, stock: 36, isNew: true },
  { id: "20", slug: "urw", sku: "IS90-020", name: "URW", price: 18000, description: "Bold design with distinctive style. Stand out from the crowd.", category: "men", images: ["urw.front.png", "urw.back.png", "urw.front.model.png", "urw.back.model.png"], sizes: SIZES, stock: 40, isNew: true },
  { id: "21", slug: "umurage", sku: "IS90-021", name: "UMURAGE", price: 18000, description: "Premium design with powerful messaging. Heritage meets modern.", category: "men", images: ["umurage.front.png", "umurage.back.png", "umurage.front.model.png", "umurage.back.model.png"], sizes: SIZES, stock: 35, isNew: true, featured: true },
  { id: "22", slug: "inkotanyi-sticker-1", sku: "IS90-022", name: "INKOTANYI STICKER 1", price: 3000, description: "Premium vinyl sticker featuring iconic Inkotanyi design. Perfect for laptops, phones, and more.", category: "accessories", images: ["sticker1.png"], sizes: ["One Size"], stock: 100, isNew: true },
  { id: "23", slug: "inkotanyi-sticker-2", sku: "IS90-023", name: "INKOTANYI STICKER 2", price: 3000, description: "Premium vinyl sticker with bold Inkotanyi graphic. Durable and stylish.", category: "accessories", images: ["sticker2.png"], sizes: ["One Size"], stock: 100, isNew: true },
  { id: "24", slug: "inkonew", sku: "IS90-024", name: "INKONEW", price: 18000, description: "Modern mens design with premium finish. Contemporary streetwear.", category: "men", images: ["inkonew.front-removebg-preview.png", "inkonew.back-removebg-preview.png", "inkonew.front.model-removebg-preview.png", "inkonew.back.model-removebg-preview.png"], sizes: SIZES, stock: 40, isNew: true },
  { id: "25", slug: "call", sku: "IS90-025", name: "CALL", price: 23000, description: "Bold calling statement. Premium design for the confident.", category: "men", images: ["call.front-removebg-preview.png", "call.back-removebg-preview.png", "call.front.model-removebg-preview.png", "call.back.model-removebg-preview.png"], sizes: SIZES, stock: 35, isNew: true },
  { id: "26", slug: "lim", sku: "IS90-026", name: "LIM", price: 18000, description: "Refined menswear piece with expert tailoring and premium detailing.", category: "men", images: ["LIM.FRONT-removebg-preview.png", "LIM.BACK-removebg-preview.png", "LIM.FRONT.MODEL-removebg-preview.png", "LIM.BACK.MODEL-removebg-preview.png"], sizes: SIZES, stock: 40, isNew: true },
  { id: "27", slug: "inkb", sku: "IS90-027", name: "INKB", price: 10000, description: "Classic streetwear piece with bold branding. Elegant and stylish.", category: "women", images: ["inkb.front-removebg-preview.png", "inkb.back-removebg-preview.png", "inkb.front.model-removebg-preview.png", "inkb.back.model-removebg-preview.png"], sizes: SIZES, stock: 50, isNew: true },
  { id: "28", slug: "ic", sku: "IS90-028", name: "IC", price: 15000, description: "Contemporary womens design with universal appeal. Premium quality at accessible price.", category: "women", images: ["ic.front-removebg-preview.png", "ic.back-removebg-preview.png", "ic.front.model-removebg-preview.png", "ic.back.model-removebg-preview.png"], sizes: SIZES, stock: 48, isNew: true },
  { id: "29", slug: "iw", sku: "IS90-029", name: "IW", price: 15000, description: "Womens streetwear with modern aesthetic. Comfortable and fashionable.", category: "women", images: ["iw.front.png", "iw.back.png", "iw.front.model.png", "iw.back.model.png"], sizes: SIZES, stock: 45, isNew: true },
  { id: "30", slug: "newone", sku: "IS90-030", name: "NEWONE", price: 18000, description: "Fresh new design with clean lines and premium quality. A standout piece.", category: "men", images: ["newone.front-removebg-preview.png", "newone.back-removebg-preview.png", "newone.front.model-removebg-preview.png", "newone.back.model-removebg-preview.png"], sizes: SIZES, stock: 40, isNew: true },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((p) => {
  const images = p.images.map(img);
  const collections = ["all", p.category];
  if (p.isNew) collections.push("new-arrivals");
  if (p.category !== "accessories") collections.push("graphic-tees");
  if (ARCHIVE_CODES.has(p.sku)) collections.push("archive");
  if (p.featured) collections.push("bestsellers");
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    tagline: p.description,
    description: p.description,
    priceCents: p.price * 100,
    category: p.category,
    categoryLabel: p.category === "men" ? "Mens" : p.category === "women" ? "Womens" : "Accessories",
    gender: p.category,
    collections,
    colors: AS_SHOWN,
    sizes: p.sizes,
    badge: p.isNew ? "NEW" : undefined,
    printStyle: "minimal",
    printLines: [p.name],
    image: images[0],
    images,
    stock: p.stock,
    featured: p.featured,
    isNew: p.isNew,
    fabric: p.category === "accessories" ? "Premium vinyl" : "Premium cotton",
    fit: p.category === "accessories" ? "One size" : p.category === "women" ? "Womens fit" : "Mens fit",
  };
});

export const COLLECTIONS = [
  {
    slug: "new-arrivals",
    title: "New",
    eyebrow: "New in",
    description: "The latest INKOTANYISINCE90 pieces.",
    image: img("ink.front-removebg-preview.model.png"),
  },
  {
    slug: "men",
    title: "Mens",
    eyebrow: "Mens",
    description: "Minimalist luxury streetwear for men.",
    image: img("urugwiro.front-removebg-preview.model.png"),
  },
  {
    slug: "women",
    title: "Womens",
    eyebrow: "Womens",
    description: "Clean INKOTANYISINCE90 designs for women.",
    image: img("ink.women.front-removebg-preview.model.png"),
  },
  {
    slug: "accessories",
    title: "Accessories",
    eyebrow: "Accessories",
    description: "Premium vinyl stickers featuring iconic Inkotanyi designs.",
    image: img("sticker1.png"),
  },
  {
    slug: "graphic-tees",
    title: "Graphic Tees",
    eyebrow: "The catalogue",
    description: "Every INKOTANYISINCE90 graphic tee, IS90-001 to IS90-030.",
    image: img("ink.athlete.front-removebg-preview.model.png"),
  },
  {
    slug: "archive",
    title: "Archive",
    eyebrow: "Heritage graphics",
    description: "Heritage-led graphics from the INKOTANYISINCE90 catalogue.",
    image: img("umurage.front.model.png"),
  },
];

export function formatPrice(cents: number) {
  return `RWF ${Math.round(cents / 100).toLocaleString("en-US")}`;
}

export function getCollectionProducts(slug: string): Product[] {
  if (slug === "all" || slug === "shop") return PRODUCTS;
  if (slug === "men" || slug === "women" || slug === "accessories") return PRODUCTS.filter((p) => p.category === slug);
  return PRODUCTS.filter((p) => p.collections.includes(slug) || p.category === slug);
}
