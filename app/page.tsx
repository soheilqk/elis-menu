"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MenuCard from "./components/MenuCard";
import { menuItems, MenuItem } from "./data/menuItems";

// Define types for our components
interface NavLinkProps {
  id: string;
  label: string;
  activeSection: string;
}

interface MenuSectionProps {
  id: string;
  title: string;
  items: MenuItem[];
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
const MenuSection = ({ id, title, items }: MenuSectionProps) => (
  <section className="mb-16 px-4" id={id}>
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-teal-800 mb-2">{title}</h2>
      <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          name={item.name}
          price={item.price}
          imagePath={item.imagePath}
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
  items: MenuItem[];
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("hot-drinks");

  // Define sections as data to avoid repetition
  const sections: Section[] = [
    {
      id: "hot-drinks",
      title: "Hot Drinks",
      items: menuItems.filter((item) => item.category === "hot"),
    },
    {
      id: "cold-drinks",
      title: "Cold Drinks",
      items: menuItems.filter((item) => item.category === "cold"),
    },
    {
      id: "cakes",
      title: "Cakes",
      items: menuItems.filter((item) => item.category === "cake"),
    },
  ];

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
  }, []);

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
            Where every sip tells a story
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
        {/* Navigation Menu */}

        {/* Menu Sections */}
        {sections.map((section) => (
          <MenuSection
            key={section.id}
            id={section.id}
            title={section.title}
            items={section.items}
          />
        ))}
      </div>
    </main>
  );
}
