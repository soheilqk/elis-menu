"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MenuCard from "./components/MenuCard";
import { supabase, type Category, type Item } from "../lib/supabase";

// Define types for our components
interface NavLinkProps {
  id: string;
  label: string;
  activeSection: string;
}

interface MenuSectionProps {
  id: string;
  title: string;
  items: Item[];
  categoryId: number;
}

// Nav link component to avoid repetition
const NavLink = ({ id, label, activeSection }: NavLinkProps) => (
  <li>
    <a
      href={`#${id}`}
      className={`transition-colors duration-300 ${
        activeSection === id
          ? "text-teal-500 font-bold border-b-2 border-teal-500"
          : "text-teal-700 hover:text-teal-900 font-medium"
      }`}
    >
      {label}
    </a>
  </li>
);

// Menu section component to avoid repetition
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

// Define interface for section objects
interface Section {
  id: string;
  title: string;
  categoryId: number;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("*")
          .order("id");

        if (categoriesError) throw categoriesError;

        // Fetch items
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .order("id");

        if (itemsError) throw itemsError;

        setCategories(categoriesData || []);
        setItems(itemsData || []);

        // Create sections from categories
        const sectionsFromCategories = (categoriesData || []).map(
          (category) => ({
            id: `category-${category.id}`,
            title: category.title,
            categoryId: category.id,
          })
        );

        setSections(sectionsFromCategories);

        // Set initial active section if we have categories
        if (sectionsFromCategories.length > 0) {
          setActiveSection(sectionsFromCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Add scroll padding to account for the sticky header
    // Increase padding to account for the full header (logo + navigation)
    document.documentElement.style.scrollPaddingTop = "180px";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sectionElements = document.querySelectorAll("section[id]");
    sectionElements.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sectionElements.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [sections]); // Re-setup observer when sections change

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-teal-50 to-teal-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-800 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

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
          <p className="text-gray-700 text-lg mt-1">
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
                activeSection={activeSection}
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
