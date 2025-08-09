import { wheels } from "../../../data/wheels";
import { Metadata } from "next";

interface GenerateMetadataProps {
  params: { id: string };
}

export function generateMetadata({ params }: GenerateMetadataProps): Metadata {
  const wheel = wheels.find((w) => w.id === parseInt(params.id));

  if (!wheel) {
    return {
      title: "Product Not Found | IVU Wheels",
      description: "The requested product could not be found.",
    };
  }

  const title = `${wheel.name} - ${wheel.category} Wheel | IVU Wheels`;
  const description = `Shop the ${wheel.name} from our ${wheel.category} collection. Premium custom wheel priced at $${wheel.price}. Free shipping available. Transform your vehicle today.`;
  const imageUrl = `/wheels2/${wheel.images[0]}`;

  return {
    title,
    description,
    keywords: [
      wheel.name.toLowerCase(),
      wheel.category.toLowerCase(),
      "custom rims",
      "wheels",
      "car accessories",
      "vehicle customization",
      "IVU Wheels",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `/products/${wheel.id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: `${wheel.name} - ${wheel.category} Wheel`,
        },
      ],
      siteName: "IVU Wheels",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/products/${wheel.id}`,
    },
  };
}
