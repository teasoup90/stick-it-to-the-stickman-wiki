import Script from "next/script";

const adsensePublisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID?.trim();
const gaMeasurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim();
const clarityProjectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID?.trim();

const validAdsensePublisherId = /^ca-pub-\d{16}$/.test(adsensePublisherId ?? "")
  ? adsensePublisherId
  : null;
const validGaMeasurementId = /^G-[A-Z0-9]{6,20}$/.test(gaMeasurementId ?? "")
  ? gaMeasurementId
  : null;
const validClarityProjectId = /^[A-Za-z0-9]{8,20}$/.test(clarityProjectId ?? "")
  ? clarityProjectId
  : null;

export function SiteIntegrations() {
  return (
    <>
      {validAdsensePublisherId ? (
        <Script
          id="adsense-loader"
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${validAdsensePublisherId}`}
          strategy="afterInteractive"
        />
      ) : null}
      {validGaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${validGaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${validGaMeasurementId}',{send_page_view:true});`}
          </Script>
        </>
      ) : null}
      {validClarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${validClarityProjectId}');`}
        </Script>
      ) : null}
    </>
  );
}
