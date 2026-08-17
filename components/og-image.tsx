import { ImageResponse } from "next/og"

const PRIMARY = "#4F46E5"
const ACCENT = "#7C3AED"
const BG = "#0B0D1C"

export function createOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${BG} 0%, #14172B 55%, #1A1230 100%)`,
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(79,70,229,0.45) 0%, rgba(79,70,229,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-160px",
            width: "560px",
            height: "560px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.35) 0%, rgba(124,58,237,0) 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
              <g
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M32 16a16 16 0 0 1 16 16" />
                <path d="M32 22a10 10 0 0 1 10 10" opacity="0.7" />
                <path d="M32 32 46 18" />
              </g>
              <circle cx="48" cy="16" r="5" fill="#ffffff" />
              <circle cx="32" cy="32" r="3" fill="#ffffff" />
            </svg>
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            FacelessBuddy
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "relative",
            maxWidth: "860px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Find profitable,{" "}
            <span
              style={{
                background: `linear-gradient(90deg, #818CF8, #A78BFA)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              unsaturated faceless
            </span>{" "}
            channels
          </div>
          <div style={{ fontSize: "30px", lineHeight: 1.4, color: "#C7CBDD" }}>
            Hand-vetted faceless YouTube channels with real numbers, outlier
            videos, and proof — updated every week.
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", position: "relative" }}>
          {["3 channels free", "No credit card required", "Cancel anytime"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#E5E7F2",
                }}
              >
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "9999px",
                    background: PRIMARY,
                  }}
                />
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}