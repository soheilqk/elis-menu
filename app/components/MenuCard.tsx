import Image from "next/image";

interface MenuCardProps {
  name: string;
  price: string;
  imagePath: string;
  description?: string;
}

export default function MenuCard({
  name,
  price,
  imagePath,
  description,
}: MenuCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
      <div className="relative w-full aspect-[1/1]">
        <Image
          src={imagePath ?? "logo.png"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL={imagePath ?? "logo.png"}
          priority
        />
      </div>
      <div className="p-4">
        <div className="flex">
          <h3 className="text-xl font-semibold text-teal-800 mb-1 grow !font-amiri">
            {name}
          </h3>
          <p className="text-teal-800 font-bold !font-pacifico">{price} T</p>
        </div>
        {description && (
          <p className="text-gray-600 text-sm mb-2 !font-amiri">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
