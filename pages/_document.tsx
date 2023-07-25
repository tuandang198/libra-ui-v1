import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>LIBRA</title>
      </Head>
      <body suppressHydrationWarning={true}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
