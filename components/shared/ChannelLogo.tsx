import Image from "next/image"

interface ChannelLogoProps {
  name: string
  imageUrl: string
  brandColor?: string
  size?: "small" | "large"
}

export function ChannelLogo({ name, imageUrl, brandColor, size = "small" }: ChannelLogoProps) {
  const sizeClasses = size === "small" ? "w-20 h-15" : "w-[100px] h-[70px]"

  return (
    <div
      className={`${sizeClasses} rounded-xl p-3 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:brightness-125`}
      style={{ backgroundColor: brandColor || "rgba(0, 0, 0, 0.4)" }}
    >
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={name}
        width={size === "small" ? 60 : 80}
        height={size === "small" ? 40 : 60}
        className="object-contain"
      />
    </div>
  )
}
