import { createOgImage } from "@/components/og-image"

export const alt =
  "FacelessBuddy — Find profitable, unsaturated faceless YouTube channels to start."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return createOgImage()
}