"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { hasAdKey } from "@/config/ads";

type BannerProps = {
  adKey?: string;
  width: number;
  height: number;
  label?: string;
  eager?: boolean;
  className?: string;
};

function bannerDocument(adKey: string, width: number, height: number) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;overflow:hidden"><script>window.atOptions={key:${JSON.stringify(adKey)},format:"iframe",height:${height},width:${width},params:{}};</script><script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script></body></html>`;
}

function nativeDocument(adKey: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head><body style="margin:0;overflow:hidden"><script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script></body></html>`;
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
        srcDoc={bannerDocument(key, width, height)}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        className="block max-w-full border-0 bg-transparent"
      />
    </div>
  );
}

export function AdsterraNativeBanner({ adKey, label = "Advertisement" }: { adKey?: string; label?: string }) {
  if (!hasAdKey(adKey)) return null;
  return (
    <div className="my-8 flex flex-col items-center" data-ad-placement="native">
      <AdvertisementLabel label={label} />
      <iframe
        title={label}
        srcDoc={nativeDocument(adKey!)}
        loading="lazy"
        scrolling="no"
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        className="block h-[90px] w-full max-w-[728px] border-0 bg-transparent"
        style={{ aspectRatio: "4 / 1", height: "auto" }}
      />
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
