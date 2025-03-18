import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <title>Metro</title>
        <meta
          name="description"
          content="An interactive map of Boston's transit system."
        />
        <meta
          name="keywords"
          content="mbta boston transit Boston transportation Boston subway MBTA map Boston public transit Massachusetts transit Boston metro Boston bus routes MBTA schedules Boston train map Massachusetts Bay Transportation Authority Boston commute Boston subway map MBTA guide Boston transit app Boston T map"
        />
       <script defer src="https://umami.hogwarts.dev/script.js" data-website-id="e5d22c87-04a8-418c-9c86-e3f7cd9739a2"/>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metro.jaspermayone.com" />
        <meta property="og:title" content="Metro" />
        <meta
          property="og:description"
          content="An interactive map of Boston's transit system."
        />
        <meta property="og:image" content="/MBTA.svg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://metro.jaspermayone.com" />
        <meta property="twitter:title" content="Metro" />
        <meta
          property="twitter:description"
          content="An interactive map of Boston's transit system."
        />
        <meta property="twitter:image" content="/MBTA.svg" />
        {/* */}
        <meta name="author" content="Jasper Mayone" />
        <meta name="robots" content="index, follow" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="194x194"
          href="/favicon-194x194.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
