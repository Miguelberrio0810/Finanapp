import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Misma "F" de barras planas que icon.svg, escalada de la retícula de 32 a 180 px
const escala = 180 / 32;
const barra = (x: number, y: number, w: number, h: number) => ({
  position: "absolute" as const,
  left: x * escala,
  top: y * escala,
  width: w * escala,
  height: h * escala,
  background: "#f3f2f2",
});

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", position: "relative", background: "#ec3013", display: "flex" }}>
        <div style={barra(8, 7, 5, 18)} />
        <div style={barra(8, 7, 16, 5)} />
        <div style={barra(8, 14.5, 12, 4)} />
      </div>
    ),
    size
  );
}
