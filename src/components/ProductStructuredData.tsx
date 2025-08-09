"use client";

interface ProductStructuredDataProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
  };
}

export default function ProductStructuredData({
  product,
}: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [`http://localhost:3001/wheels2/${product.image}`],
    description:
      product.description ||
      `Premium ${product.category} wheel from IVU Wheels collection. High-quality custom rim designed for performance and style.`,
    sku: `IVU-${product.id}`,
    mpn: `IVU${product.id}`,
    brand: {
      "@type": "Brand",
      name: "IVU Wheels",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `http://localhost:3001/products/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 1 year from now
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "IVU Wheels",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 5,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "John D.",
        },
        reviewBody:
          "Amazing quality wheels, perfect fit and excellent customer service!",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
