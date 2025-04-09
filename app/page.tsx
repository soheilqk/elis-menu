import Image from "next/image";
import MenuCard from "./components/MenuCard";
import { supabase, type Category, type Item } from "../lib/supabase";

export const revalidate = 3600; // 1 hour

// Define types for our components
interface NavLinkProps {
  id: string;
  label: string;
  // activeSection: string; // Removed for SSR
}

interface MenuSectionProps {
  id: string;
  title: string;
  items: Item[];
  categoryId: number;
}

// Nav link component to avoid repetition
// Removed activeSection logic
const NavLink = ({ id, label }: NavLinkProps) => (
  <li>
    <a
      href={`#${id}`}
      className="transition-colors duration-300 text-teal-700 hover:text-teal-900 font-medium !font-pacifico"
    >
      {label}
    </a>
  </li>
);

// Menu section component (unchanged conceptually, but used with SSR data)
const MenuSection = ({ id, title, items, categoryId }: MenuSectionProps) => (
  <section className="mb-16 px-4" id={id}>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-teal-800 mb-2">{title}</h2>
      <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items
        .filter((item) => item.category === categoryId)
        .map((item) => (
          <MenuCard
            key={item.id}
            name={item.title}
            price={item.price.toString()}
            imagePath={item.image_path || "/images/placeholder.jpg"}
            description={item.description}
          />
        ))}
    </div>
  </section>
);

// Define interface for section objects (remains the same)
interface Section {
  id: string;
  title: string;
  categoryId: number;
}

// Make the component async for server-side data fetching
export default async function Home() {
  let categories: Category[] = [];
  let items: Item[] = [];
  let sections: Section[] = [];
  let errorFetching: boolean = false;

  // Fetch data directly on the server
  try {
    // Fetch categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .order("id");

    if (categoriesError) throw categoriesError;
    categories = categoriesData || [];

    // Fetch items
    const { data: itemsData, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .order("id");

    if (itemsError) throw itemsError;
    items = itemsData || [];

    // Create sections from categories
    sections = (categoriesData || []).map((category) => ({
      id: `category-${category.id}`,
      title: category.title,
      categoryId: category.id,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    // Set a flag to display an error message or handle appropriately
    errorFetching = true;
    // Optionally re-throw or handle specific errors differently
  }

  // Add scroll padding directly in the component (if still needed)
  // Note: This style manipulation might be better handled in CSS or a layout component
  // but keeping it here to show where equivalent logic might go.
  // However, direct DOM manipulation like this won't work server-side.
  // Consider moving this to CSS or a client component if dynamic padding is essential.
  // useEffect(() => {
  //   document.documentElement.style.scrollPaddingTop = "180px";
  // }, []); // This useEffect logic is removed as it's client-side

  // Handle potential data fetching errors
  if (errorFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Error Loading Menu
          </h1>
          <p className="text-red-600">
            Sorry, we couldn't load the menu data at this time. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  // No loading state needed anymore

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-teal-100">
      <header className="sticky top-0 z-50 px-4 pt-4 pb-0 text-center bg-white shadow-md rounded-b-2xl mb-4">
        <div className="max-w-4xl mx-auto ">
          <Image
            src="/logo.png"
            alt="Eli's Coffee Shop"
            width={100}
            height={100}
            className="mx-auto"
          />
          <p className="text-gray-700 text-lg mt-1 !font-pacifico">
            Life is the art of baking
          </p>
        </div>
        <nav className="p-4">
          <ul className="flex justify-center space-x-8 md:space-x-16">
            {sections.map((section) => (
              <NavLink
                key={section.id}
                id={section.id}
                label={section.title}
                // activeSection prop removed
              />
            ))}
          </ul>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto pb-16">
        {/* Menu Sections */}
        {sections.map((section) => (
          <MenuSection
            key={section.id}
            id={section.id}
            title={section.title}
            items={items}
            categoryId={section.categoryId}
          />
        ))}
      </div>
    </main>
  );
}
