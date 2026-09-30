"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AD_CONFIG, hasAdKey } from "@/config/ads";

type BannerProps = {
  adKey?: string;
  width: number;
  height: number;
  label?: string;
  eager?: boolean;
  className?: string;
};

// Banners load through a same-origin frame page (public/ads/banner/index.html)
// so the Adsterra loader sees this site's real domain.
function bannerFrameSrc(adKey: string, width: number, height: number) {
  const params = new URLSearchParams({ k: adKey, w: String(width), h: String(height) });
  return `/ads/banner/?${params.toString()}`;
}


function AdvertisementLabel({ label }: { label: string }) {
  return <p className="mb-1 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>;
}

export function AdsterraBanner({ adKey, width, height, label = "Advertisement", eager = false, className = "" }: BannerProps) {
  if (!hasAdKey(adKey)) return null;
  const key = adKey!;
  return (
    <div className={`my-8 flex flex-col items-center ${className}`} data-ad-placement={`${width}x${height}`}>
      <AdvertisementLabel label={label} />
      <iframe
        title={label}
        src={bannerFrameSrc(key, width, height)}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="block max-w-full border-0 bg-transparent"
      />
    </div>
  );
}

// Native Banner follows the Adsterra snippet: async invoke.js from the site's
// script host plus a `container-<key>` div, rendered directly in the page.
export function AdsterraNativeBanner({ adKey, label = "Advertisement" }: { adKey?: string; label?: string }) {
  const ready = hasAdKey(adKey);
  useEffect(() => {
    if (!ready) return;
    const src = `https://${AD_CONFIG.nativeScriptHost}/${adKey}/invoke.js`;
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = src;
    document.body.appendChild(script);
  }, [ready, adKey]);
  if (!ready) return null;
  return (
    <div className="my-8 flex flex-col items-center" data-ad-placement="native">
      <AdvertisementLabel label={label} />
      <div id={`container-${adKey}`} className="w-full max-w-[728px]" />
    </div>
  );
}

export function DismissibleStickyBanner({ adKey, label = "Advertisement" }: { adKey?: string; label?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (!hasAdKey(adKey) || dismissed) return null;
  return (
    <div className="sticky top-20 z-20 mt-5 py-2">
      <div className="relative mx-auto max-w-4xl pr-10">
        <button type="button" aria-label={`Close ${label}`} onClick={() => setDismissed(true)} className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/95 p-1 text-muted-foreground shadow-sm hover:text-foreground">
          <X className="size-4" />
        </button>
        <AdsterraBanner adKey={adKey} width={320} height={50} label={label} eager className="my-0" />
      </div>
    </div>
  );
}

export function DesktopSidebarAds({ leftAdKey, rightAdKey, label = "Advertisement" }: { leftAdKey?: string; rightAdKey?: string; label?: string }) {
  if (!hasAdKey(leftAdKey) && !hasAdKey(rightAdKey)) return null;
  return <>
    {hasAdKey(leftAdKey) && <aside aria-label={label} className="fixed left-[calc((100vw-1232px)/2-180px)] top-20 z-10 hidden min-[1600px]:block"><AdsterraBanner adKey={leftAdKey} width={160} height={600} label={label} eager className="my-0" /></aside>}
    {hasAdKey(rightAdKey) && <aside aria-label={label} className="fixed right-[calc((100vw-1232px)/2-180px)] top-20 z-10 hidden min-[1600px]:block"><AdsterraBanner adKey={rightAdKey} width={160} height={300} label={label} eager className="my-0" /></aside>}
  </>;
}
