import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title = "IVU Wheels - Premium Custom Rims & Wheels",
  description = "Discover premium custom rims and wheels that define your drive. Shop Performance, Modular, and Flow collections with free shipping.",
  keywords = [
    "custom rims",
    "wheels",
    "performance rims",
    "modular wheels",
    "flow rims",
  ],
  image = "/wheelsshop/masinafundal1.webp",
  url = "",
  type = "website",
}: SEOHeadProps) {
  const fullUrl = `http://localhost:3001${url}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="IVU Wheels" />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="IVU Wheels" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <link rel="canonical" href={fullUrl} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "IVU Wheels",
            description: description,
            url: fullUrl,
            logo: "http://localhost:3001/wheelsshop/Icon.svg",
            image: image,
            address: {
              "@type": "PostalAddress",
              addressCountry: "US",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
            },
            sameAs: ["http://localhost:3001/coming-soon"],
          }),
        }}
      />
    </Head>
  );
}
