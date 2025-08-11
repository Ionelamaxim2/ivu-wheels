"use client";

import { wheels } from "../../../data/wheels";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";

import Link from "next/link";
import FooterSection from "@/components/FooterSection";
import { cartStore } from "../../../lib/cartStore";
import ProductStructuredData from "../../../components/ProductStructuredData";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { useToast } from "../../../components/Toast";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const wheel = wheels.find((w) => w.id === parseInt(params.id));
  const { addToast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [carError, setCarError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!wheel) {
    notFound();
  }

  const handleAddToCart = () => {
    try {
      let hasError = false;
      if (!selectedCar) {
        setCarError(true);
        hasError = true;
      }
      if (!selectedSize) {
        setSizeError(true);
        hasError = true;
      }
      if (hasError) {
        addToast({
          message: "Please select CAR and SIZE before adding to cart",
          type: "error",
          duration: 3000,
        });
        return;
      }
      const cartItem = {
        id: wheel.id,
        name: wheel.name,
        price: wheel.price,
        quantity: quantity,
        image: wheel.images[0],
        buttonColor: wheel.buttonColor,
        cardBg: wheel.cardBg,
        size: selectedSize,
        car: selectedCar,
      };

      cartStore.addItem(cartItem);

      try {
        const key = (function () {
          try {
            const u = JSON.parse(localStorage.getItem("user") || "null");
            return u && u.email ? "cart:" + u.email : "cart";
          } catch (e) {
            return "cart";
          }
        })();
        let cartItems: any[] = [];
        try {
          const savedCart = localStorage.getItem(key);
          cartItems = savedCart ? JSON.parse(savedCart) : [];
        } catch (e) {
          console.error("localStorage read failed:", e);
          cartItems = [];
        }

        const existingItemIndex = cartItems.findIndex(
          (item: any) => item.id === wheel.id
        );

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          cartItems.push(cartItem);
        }

        try {
          localStorage.setItem(key, JSON.stringify(cartItems));
        } catch {}
        sessionStorage.setItem("cart", JSON.stringify(cartItems));
        try {
          window.dispatchEvent(new Event("cart-updated"));
        } catch {}
      } catch (e) {
        console.error("localStorage save failed:", e);
      }

      addToast({
        message: `${wheel.name} added to cart successfully!`,
        type: "success",
        duration: 3000,
        customColor: wheel.buttonColor,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast({
        message: "Error adding to cart: " + (error as Error).message,
        type: "error",
        duration: 4000,
        customColor: wheel.buttonColor,
      });
    }
  };

  const getSimilarWheels = () => {
    return wheels
      .filter((w) => w.id !== wheel.id && w.category === wheel.category)
      .slice(0, 6);
  };

  const isLightColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const textColor = isLightColor(wheel.cardBg) ? "black" : "white";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const check = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        setIsLoggedIn(!!u);
      } catch {}
    };
    check();
    const onAuth = () => check();
    window.addEventListener("auth-updated", onAuth);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") check();
    };
    window.addEventListener("storage", onStorage as any);
    return () => {
      window.removeEventListener("auth-updated", onAuth);
      window.removeEventListener("storage", onStorage as any);
    };
  }, []);

  return (
    <div
      style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "black" }}
    >
      {/* Toast notifications handled by ToastProvider */}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "1rem 2rem 1rem 2rem" : "1rem 2rem 1rem 3rem",
          backgroundColor: "#000000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            onClick={() => (window.location.href = "/")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              border: "2px solid white",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <span
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: "1rem",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
              }}
            >
              IVU
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/cart"
            aria-label="Open cart"
            style={{ color: "white", textDecoration: "none" }}
          >
            <span style={{ position: "relative", display: "inline-block" }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "34px", height: "34px" }}
              >
                <path
                  d="M6 6h15l-1.5 9h-12z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="9"
                  cy="20"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="18"
                  cy="20"
                  r="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                id="nav-cart-badge"
                style={{
                  position: "absolute",
                  top: -6,
                  right: -8,
                  background: "white",
                  color: "black",
                  borderRadius: "999px",
                  padding: "0 6px",
                  fontSize: 12,
                  lineHeight: "18px",
                  minWidth: 18,
                  textAlign: "center",
                }}
              ></span>
            </span>
          </Link>
          {isLoggedIn ? (
            <Link
              href="/user"
              id="nav-auth"
              style={{
                color: "white",
                padding: "0.3rem 0.6rem",
                borderRadius: "20px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.4)",
                background: "transparent",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          ) : (
            <Link
              href="/login"
              id="nav-auth"
              style={{
                color: "white",
                padding: "0.4rem 1.2rem",
                borderRadius: "20px",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: "bold",
                border: "1px solid white",
                background: "transparent",
                textTransform: "uppercase",
              }}
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>

      {/* Breadcrumbs */}
      {!isMobile && (
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}
        >
          <Breadcrumbs
            items={[
              { name: "Products", href: "/products" },
              {
                name: wheel.category,
                href: `/products?category=${wheel.category}`,
              },
            ]}
            currentPage={wheel.name}
          />
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          function key(){
            try{ var u = JSON.parse(localStorage.getItem('user')||'null'); return u && u.email ? ('cart:'+u.email) : 'cart'; }catch(e){ return 'cart'; }
          }
          function update(){
            try{
              var u = JSON.parse(localStorage.getItem('user')||'null');
              var link = document.getElementById('nav-auth');
              if(u && link){
                link.setAttribute('href','/user');
                link.innerHTML = '<svg width=20 height=20 viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'></path><circle cx=\'12\' cy=\'7\' r=\'4\'></circle></svg>';
                link.style.border = '1px solid rgba(255,255,255,0.4)';
                link.style.padding = '0.3rem 0.6rem';
              }
              var badge = document.getElementById('nav-cart-badge');
              if(!badge){
                var cartIconWrap = document.querySelector('a[href="/cart"] span');
                if(cartIconWrap){
                  badge = document.createElement('span');
                  badge.id='nav-cart-badge';
                  cartIconWrap.appendChild(badge);
                }
              }
              if(badge){
                badge.style.position='absolute';
                badge.style.top='-6px';
                badge.style.right='-8px';
                badge.style.background='white';
                badge.style.color='black';
                badge.style.borderRadius='999px';
                badge.style.padding='0 6px';
                badge.style.fontSize='12px';
                badge.style.lineHeight='18px';
                badge.style.minWidth='18px';
                badge.style.textAlign='center';
                var cart = JSON.parse(localStorage.getItem(key())||'[]');
                var count = cart.reduce(function(s,i){return s+(i.quantity||0)},0);
                badge.textContent = count>0? String(count): '';
              }
            }catch(e){}
          }
          update();
          window.addEventListener('cart-updated', update);
          window.addEventListener('auth-updated', update);
          window.addEventListener('storage', function(ev){ if(ev.key==='user') update(); });
        })();
      `,
        }}
      />

      <div
        style={{
          maxWidth: "100%",
          margin: "0",
          padding: "0",
          marginTop: isMobile ? "0" : "0",
        }}
      >
        {/* Back Button */}
        <div
          style={{
            padding: "0rem 1rem",
            position: "relative",
            top: "auto",
            left: "auto",
            zIndex: 10,
            marginTop: isMobile ? "1rem" : "-2rem",
            marginLeft: isMobile ? "0" : "-0.5rem",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <button
            onClick={() => (window.location.href = "/products")}
            style={{
              display: "flex",
              height: isMobile ? "3em" : "3em",
              width: isMobile ? "100px" : "130px",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: wheel.buttonColor,
              borderRadius: "3px",
              letterSpacing: "1px",
              transition: "all 0.2s linear",
              cursor: "pointer",
              border: "none",
              color: isLightColor(wheel.buttonColor) ? "black" : "white",
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              height={isMobile ? "16" : "20"}
              width={isMobile ? "16" : "20"}
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 1024 1024"
              style={{
                marginRight: "5px",
                marginLeft: "5px",
                fontSize: "20px",
                transition: "all 0.4s ease-in",
                fill: isLightColor(wheel.buttonColor) ? "black" : "white",
              }}
            >
              <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
            </svg>
            <span>Back</span>
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "2rem" : "4rem",
            alignItems: "start",
            paddingLeft: isMobile ? "1rem" : "2rem",
            paddingRight: isMobile ? "1rem" : "4rem",
            paddingTop: isMobile ? "0.5rem" : "2rem",
          }}
        >
          {/* Left Side - Diagonal Image Carousel */}
          <div
            style={{
              position: "relative",
              height: isMobile ? "400px" : "600px",
            }}
          >
            {/* Carousel Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Previous Image (Left) */}
              <div
                style={{
                  position: "absolute",
                  left: isMobile ? "10%" : "-25%",
                  top: isMobile ? "50%" : "-3%",
                  transform: isMobile
                    ? "translate(-50%, -50%)"
                    : "translateY(-50%) rotate(-15deg)",
                  width: isMobile ? "120px" : "450px",
                  height: isMobile ? "120px" : "450px",
                  opacity: isMobile ? 0.4 : 0.15,
                  zIndex: 2,
                }}
              >
                <img
                  src={`/wheels2/${
                    wheel.images[
                      selectedImage > 0
                        ? selectedImage - 1
                        : wheel.images.length - 1
                    ]
                  }`}
                  alt="Previous"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: isMobile
                      ? "blur(2px) grayscale(0.5) brightness(0.7)"
                      : "grayscale(0.8) brightness(0.6)",
                  }}
                />
              </div>

              {/* Main Image (Center) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: isMobile ? "50%" : "60%",
                  transform: isMobile
                    ? "translate(-50%, -50%)"
                    : "translate(-50%, -50%) rotate(-5deg)",
                  width: isMobile ? "300px" : "600px",
                  height: isMobile ? "300px" : "600px",
                  opacity: 1,
                  zIndex: 3,
                }}
              >
                <img
                  src={`/wheels2/${wheel.images[selectedImage]}`}
                  alt={wheel.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Next Image (Right) */}
              <div
                style={{
                  position: "absolute",
                  right: isMobile ? "10%" : "-30%",
                  top: isMobile ? "50%" : "120%",
                  transform: isMobile
                    ? "translate(50%, -50%)"
                    : "translateY(-50%) rotate(15deg)",
                  width: isMobile ? "120px" : "450px",
                  height: isMobile ? "120px" : "450px",
                  opacity: isMobile ? 0.4 : 0.15,
                  zIndex: 2,
                }}
              >
                <img
                  src={`/wheels2/${
                    wheel.images[
                      selectedImage < wheel.images.length - 1
                        ? selectedImage + 1
                        : 0
                    ]
                  }`}
                  alt="Next"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: isMobile
                      ? "blur(2px) grayscale(0.5) brightness(0.7)"
                      : "grayscale(0.8) brightness(0.6)",
                  }}
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            {isMobile ? (
              // Mobile: Arrows at bottom, side by side
              <div
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "4rem",
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() =>
                    setSelectedImage(
                      selectedImage > 0
                        ? selectedImage - 1
                        : wheel.images.length - 1
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "2px solid black",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    color: "black",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setSelectedImage(
                      selectedImage < wheel.images.length - 1
                        ? selectedImage + 1
                        : 0
                    )
                  }
                  style={{
                    background: "transparent",
                    border: "2px solid black",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    color: "black",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  →
                </button>
              </div>
            ) : (
              // Desktop: Original vertical arrows
              <>
                <button
                  onClick={() =>
                    setSelectedImage(
                      selectedImage > 0
                        ? selectedImage - 1
                        : wheel.images.length - 1
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "transparent",
                    border: "2px solid black",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "black",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  ↑
                </button>
                <button
                  onClick={() =>
                    setSelectedImage(
                      selectedImage < wheel.images.length - 1
                        ? selectedImage + 1
                        : 0
                    )
                  }
                  style={{
                    position: "absolute",
                    bottom: "-100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "transparent",
                    border: "2px solid black",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    color: "black",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  ↓
                </button>
              </>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div style={{ paddingTop: "2rem" }}>
            <h1
              style={{
                fontSize: isMobile ? "2rem" : "3rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "black",
                fontFamily: "Just, Arial, sans-serif",
              }}
            >
              IVU
            </h1>

            <h2
              style={{
                fontSize: isMobile ? "1.2rem" : "1.4rem",
                fontWeight: "300",
                marginBottom: isMobile ? "1.5rem" : "2rem",
                color: "black",
                opacity: 0.8,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              {wheel.name}
            </h2>

            <div
              style={{
                fontSize: isMobile ? "1.3rem" : "1.5rem",
                fontWeight: "bold",
                marginBottom: isMobile ? "2rem" : "3rem",
                color: "black",
              }}
            >
              PRICE: €{wheel.price},00
            </div>

            {/* Content wrapper to push button to bottom */}
            <div style={{ flex: 1 }}>
              {/* Car and Size Selection - Side by Side */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Car Selection */}
                <div style={{ flex: 1 }}>
                  <select
                    value={selectedCar}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCar(val);
                      if (val) setCarError(false);
                    }}
                    style={{
                      background: "white",
                      border: carError
                        ? "2px solid #ff4d4d"
                        : "2px solid black",
                      borderRadius: "50px",
                      color: "black",
                      padding: "1rem 1.5rem",
                      width: "100%",
                      fontSize: "1rem",
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "600",
                      textAlign: "center",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option
                      value=""
                      style={{ background: "white", color: "black" }}
                    >
                      CAR
                    </option>
                    {wheel.compatibleCars.map((car) => (
                      <option
                        key={car}
                        value={car}
                        style={{ background: "white", color: "black" }}
                      >
                        {car}
                      </option>
                    ))}
                  </select>
                  {carError && (
                    <div
                      style={{
                        color: "#ff4d4d",
                        fontSize: "0.8rem",
                        marginTop: "0.35rem",
                      }}
                    >
                      Please select a car
                    </div>
                  )}
                </div>

                {/* Size Selection */}
                <div style={{ flex: 1 }}>
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedSize(val);
                      if (val) setSizeError(false);
                    }}
                    style={{
                      background: "white",
                      border: sizeError
                        ? "2px solid #ff4d4d"
                        : "2px solid black",
                      borderRadius: "50px",
                      color: "black",
                      padding: "1rem 1.5rem",
                      width: "100%",
                      fontSize: "1rem",
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "600",
                      textAlign: "center",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1em",
                      paddingRight: "3rem",
                    }}
                  >
                    <option
                      value=""
                      style={{ background: "white", color: "black" }}
                    >
                      SIZE
                    </option>
                    {wheel.size.map((size) => (
                      <option
                        key={size}
                        value={size}
                        style={{ background: "white", color: "black" }}
                      >
                        {size}
                      </option>
                    ))}
                  </select>
                  {sizeError && (
                    <div
                      style={{
                        color: "#ff4d4d",
                        fontSize: "0.8rem",
                        marginTop: "0.35rem",
                      }}
                    >
                      Please select a size
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "stretch" : "center",
                  gap: "1rem",
                }}
              >
                <label
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "400",
                    color: "black",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    fontFamily: "Poppins, Arial, sans-serif",
                  }}
                >
                  Quantity
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: "transparent",
                      border: "1px solid black",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const n = e.currentTarget.valueAsNumber;
                      if (Number.isNaN(n)) return;
                      const clamped = Math.max(1, Math.min(20, Math.floor(n)));
                      setQuantity(clamped);
                    }}
                    style={{
                      background: "white",
                      border: "1px solid black",
                      borderRadius: "25px",
                      padding: "0.8rem 1.2rem",
                      fontSize: "0.9rem",
                      width: "100px",
                      textAlign: "center",
                      fontFamily: "Arial, sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                    }}
                    min={1}
                    max={20}
                    step={1}
                    inputMode="numeric"
                    aria-label="Quantity"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    style={{
                      background: "transparent",
                      border: "1px solid black",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      fontSize: "18px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button - Same row on desktop, separate on mobile */}
                {!isMobile && (
                  <button
                    onClick={handleAddToCart}
                    style={{
                      background: wheel.buttonColor,
                      backgroundImage:
                        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.08))",
                      color: isLightColor(wheel.buttonColor)
                        ? "black"
                        : "white",
                      border: `2px solid ${
                        isLightColor(wheel.buttonColor)
                          ? "rgba(0,0,0,0.25)"
                          : "rgba(255,255,255,0.6)"
                      }`,
                      borderRadius: "50px",
                      padding: "1.6rem 3rem",
                      fontSize: "1.15rem",
                      fontWeight: "800",
                      cursor:
                        !selectedCar || !selectedSize
                          ? "not-allowed"
                          : "pointer",
                      flex: "1",
                      transition: "all 0.25s ease",
                      fontFamily: "Gruppo, Arial, sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      opacity: !selectedCar || !selectedSize ? 0.5 : 1,
                      boxShadow:
                        "0 12px 24px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.15)",
                      textShadow: isLightColor(wheel.buttonColor)
                        ? "none"
                        : "0 1px 1px rgba(0,0,0,0.35)",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 16px 28px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.15)";
                    }}
                  >
                    ADD TO CART
                  </button>
                )}
              </div>

              {/* Add to Cart Button - Separate Row on Mobile Only */}
              {isMobile && (
                <div style={{ width: "100%", marginTop: "1rem" }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      background: wheel.buttonColor,
                      backgroundImage:
                        "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.08))",
                      color: isLightColor(wheel.buttonColor)
                        ? "black"
                        : "white",
                      border: `2px solid ${
                        isLightColor(wheel.buttonColor)
                          ? "rgba(0,0,0,0.25)"
                          : "rgba(255,255,255,0.6)"
                      }`,
                      borderRadius: "50px",
                      padding: "1.2rem 2.2rem",
                      fontSize: "1.05rem",
                      fontWeight: "800",
                      cursor:
                        !selectedCar || !selectedSize
                          ? "not-allowed"
                          : "pointer",
                      width: "100%",
                      transition: "all 0.25s ease",
                      fontFamily: "Gruppo, Arial, sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      opacity: !selectedCar || !selectedSize ? 0.5 : 1,
                      boxShadow:
                        "0 10px 22px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.15)",
                      textShadow: isLightColor(wheel.buttonColor)
                        ? "none"
                        : "0 1px 1px rgba(0,0,0,0.35)",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 14px 26px rgba(0,0,0,0.3), 0 0 0 4px rgba(255,255,255,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 22px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.15)";
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              )}
            </div>

            {/* Wheel Info */}
            <div
              style={{
                padding: "1.5rem",
                marginBottom: "1rem",
                marginLeft: isMobile ? "0" : "5rem",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "black",
                  fontFamily: "Gruppo, Arial, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Wheel info:
              </h3>
              <div
                style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#666" }}
              >
                <div>
                  <strong>Model:</strong> {wheel.description}
                </div>
                <div>
                  <strong>Design:</strong> {wheel.specs[0]}
                </div>
                <div>
                  <strong>Finish:</strong> {wheel.specs[1]}
                </div>
                <div>
                  <strong>Production Technique:</strong> {wheel.specs[2]}
                </div>
                <div>
                  <strong>Wheel Cap:</strong> {wheel.specs[3]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div
          style={{
            marginTop: isMobile ? "4rem" : "9rem",
            marginBottom: "6rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "500",
              textAlign: "center",
              marginBottom: "5rem",
              color: "black",
              fontFamily: "Gruppo, Arial, sans-serif",
              letterSpacing: "2px",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            SIMILAR
          </h2>

          <div
            style={{
              display: isMobile ? "grid" : "flex",
              gridTemplateColumns: isMobile ? "1fr 1fr" : undefined,
              gridTemplateRows: isMobile ? "1fr 1fr" : undefined,
              gap: isMobile ? "1rem" : "7rem",
              justifyContent: "center",
              justifyItems: isMobile ? "center" : undefined,
              flexWrap: "wrap",
              maxWidth: isMobile ? "100%" : undefined,
              margin: isMobile ? "0 auto" : undefined,
              padding: isMobile ? "0 1rem" : "0",
            }}
          >
            {getSimilarWheels()
              .slice(0, isMobile ? 4 : 3)
              .map((similarWheel) => (
                <Link
                  key={similarWheel.id}
                  href={`/products/${similarWheel.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      height: isMobile ? "200px" : "350px",
                      width: isMobile ? "150px" : "290px",
                      perspective: "1000px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        height: "100%",
                        borderRadius: "30px",
                        background: wheel.cardBg,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        transformStyle: "preserve-3d",
                        transform: "none",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: "8px",
                          borderRadius: "25px",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                          borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
                          background:
                            "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
                          backdropFilter: "blur(4px)",
                          WebkitBackdropFilter: "blur(4px)",
                          transformStyle: "preserve-3d",
                          transform: "translate3d(0,0,25px)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          right: "8px",
                          bottom: isMobile ? "50px" : "80px",
                          transform: "translate3d(0,0,26px)",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            height: "100%",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: "20px",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                          }}
                        >
                          <img
                            src={`/wheels2/${similarWheel.images[0]}`}
                            alt={similarWheel.name}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "contain",
                              filter:
                                "brightness(1.15) contrast(1.1) saturate(1.1)",
                              padding: "10px",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              inset: "0",
                              background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%, rgba(255, 255, 255, 0.02) 100%)",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "50px",
                          left: "0",
                          right: "0",
                          transform: "translate3d(0,0,26px)",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: isMobile ? "18px" : "24px",
                            fontWeight: "bold",
                            color: textColor,
                            fontFamily: "Gruppo, Arial, sans-serif",
                            textShadow:
                              textColor === "white"
                                ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                                : "0 2px 8px rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          €{similarWheel.price}
                        </span>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "16px",
                          left: "0",
                          right: "0",
                          display: "flex",
                          justifyContent: "center",
                          transformStyle: "preserve-3d",
                          transform: "translate3d(0,0,26px)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            cursor: "pointer",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease-in-out",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            borderRadius: "20px",
                            padding: "8px 16px",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                          }}
                        >
                          <button
                            style={{
                              border: "none",
                              background: "none",
                              fontSize: "13px",
                              fontWeight: "bold",
                              color: textColor,
                              fontFamily: "Gruppo, Arial, sans-serif",
                              cursor: "pointer",
                            }}
                          >
                            View Details
                          </button>
                          <svg
                            style={{
                              marginLeft: "6px",
                              height: "14px",
                              width: "14px",
                              stroke: textColor,
                              strokeWidth: "2.5",
                              fill: "none",
                            }}
                            viewBox="0 0 24 24"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          transformStyle: "preserve-3d",
                          transform: "translate3d(0,0,30px)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            placeContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.9)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            transition: "all 0.3s ease-in-out",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            style={{ width: "18px", fill: "black" }}
                          >
                            <text
                              x="50"
                              y="60"
                              textAnchor="middle"
                              fontSize="40"
                              fontWeight="bold"
                              fontFamily="Gruppo, Arial, sans-serif"
                              fill="currentColor"
                            >
                              IVU
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <FooterSection />
      </div>

      {/* SEO Structured Data */}
      <ProductStructuredData
        product={{
          id: wheel.id,
          name: wheel.name,
          price: wheel.price,
          image: wheel.images[0],
          category: wheel.category,
          description: `Premium ${wheel.category} wheel from IVU Wheels. High-quality custom rim designed for performance and style.`,
        }}
      />
    </div>
  );
}
