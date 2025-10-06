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
        {/* <meta
          name="description"
          content="An interactive map of Boston's transit system."
        />
        <meta
          name="keywords"
          content="mbta boston transit Boston transportation Boston subway MBTA map Boston public transit Massachusetts transit Boston metro Boston bus routes MBTA schedules Boston train map Massachusetts Bay Transportation Authority Boston commute Boston subway map MBTA guide Boston transit app Boston T map"
        />

        <script defer src="https://umami.hogwarts.dev/script.js" data-website-id="e5d22c87-04a8-418c-9c86-e3f7cd9739a2"/>


        {/* */}
        {/* <meta name="author" content="Jasper Mayone" /> */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />

      </Head>
      <Component {...pageProps} />
    </>
  );
}
