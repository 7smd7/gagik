import Script from 'next/script'

interface AnalyticsProps {
  clarityId?: string | null
  googleAnalyticsId?: string | null
  customScripts?: string | null
}

export function Analytics({ clarityId, googleAnalyticsId, customScripts }: AnalyticsProps) {
  return (
    <>
      {/* Microsoft Clarity */}
      {clarityId && (
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      )}

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}');
            `}
          </Script>
        </>
      )}

      {/* Custom Scripts */}
      {customScripts && (
        <Script id="custom-scripts" strategy="afterInteractive">
          {customScripts}
        </Script>
      )}
    </>
  )
}
