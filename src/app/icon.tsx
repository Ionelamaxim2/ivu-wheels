import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon({
  searchParams,
}: {
  searchParams?: { size?: string };
}) {
  const iconSize = searchParams?.size ? parseInt(searchParams.size) : 32;
  const fontSize = iconSize > 100 ? iconSize / 4 : iconSize / 1.5;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: fontSize,
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        IVU
      </div>
    ),
    {
      width: iconSize,
      height: iconSize,
    }
  );
}
