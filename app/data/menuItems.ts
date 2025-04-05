export interface MenuItem {
  id: string;
  name: string;
  price: string;
  imagePath: string;
  description?: string;
  category: "hot" | "cold" | "cake";
}

export const menuItems: MenuItem[] = [
  // Hot Drinks
  {
    id: "espresso",
    name: "اسپرسو",
    price: "50",
    imagePath: "/images/drinks/espresso.jpg",
    category: "hot",
  },
  {
    id: "double-espresso",
    name: "دابل اسپرسو",
    price: "60",
    imagePath: "/images/drinks/double-espresso.jpg",
    category: "hot",
  },
  {
    id: "latte",
    name: "لته معمولی",
    price: "80",
    imagePath: "/images/drinks/latte.jpg",
    category: "hot",
  },
  {
    id: "cappuccino",
    name: "کاپوچینو",
    price: "80",
    imagePath: "/images/drinks/cappuccino.jpg",
    category: "hot",
  },
  {
    id: "mocha",
    name: "موکا",
    price: "95",
    imagePath: "/images/drinks/mocha.jpg",
    category: "hot",
  },

  // Cold Drinks
  {
    id: "iced-americano",
    name: "آیس آمریکانو",
    price: "70",
    imagePath: "/images/drinks/iced-americano.jpg",
    category: "cold",
  },
  {
    id: "frappuccino",
    name: "فرابوچینو",
    price: "120",
    imagePath: "/images/drinks/frappuccino.jpg",
    category: "cold",
  },
  {
    id: "iced-mocha",
    name: "آیس موکا",
    price: "95",
    imagePath: "/images/drinks/iced-mocha.jpg",
    category: "cold",
  },
  {
    id: "lemonade",
    name: "لیموناد",
    price: "85",
    imagePath: "/images/drinks/lemonade.jpg",
    category: "cold",
  },

  // Cakes
  {
    id: "chocolate-cake",
    name: "کیک شکلاتی",
    price: "75",
    imagePath: "/images/cakes/chocolate-cake.jpg",
    description: "کیک شکلاتی خوشمزه",
    category: "cake",
  },
  {
    id: "cheesecake",
    name: "چیز کیک",
    price: "85",
    imagePath: "/images/cakes/cheesecake.jpg",
    description: "چیز کیک لطیف",
    category: "cake",
  },
  {
    id: "carrot-cake",
    name: "کیک هویج",
    price: "70",
    imagePath: "/images/cakes/carrot-cake.jpg",
    description: "کیک هویج با فراستینگ پنیری",
    category: "cake",
  },
];
