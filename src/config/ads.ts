export const AD_CONFIG = {
  nativeBanner: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER,
  // Script host from the Adsterra "GET CODE" snippet for this site's Native Banner (placement 31400430).
  nativeScriptHost: process.env.NEXT_PUBLIC_AD_NATIVE_SCRIPT_HOST || "pl31500929.profitableratecpmnetwork.com",
  banner728x90: process.env.NEXT_PUBLIC_AD_BANNER_728X90,
  banner300x250: process.env.NEXT_PUBLIC_AD_BANNER_300X250,
  banner468x60: process.env.NEXT_PUBLIC_AD_BANNER_468X60,
  mobile320x50: process.env.NEXT_PUBLIC_AD_MOBILE_320X50,
  sidebar160x600: process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600,
  sidebar160x300: process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300
} as const;

export function hasAdKey(adKey: string | undefined) {
  return Boolean(adKey && adKey !== "0" && /^[a-f0-9]{32}$/i.test(adKey));
}
