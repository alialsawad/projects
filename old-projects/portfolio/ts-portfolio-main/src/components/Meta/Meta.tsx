import Head from 'next/head';

const siteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
const name = 'Ali Alsawad';

interface MetaProps {
  title?: string;
  description?: string;
  prefix?: string;
}

export const Meta = ({ title, description, prefix = name }: MetaProps) => {
  const titleText = [prefix, title].filter(Boolean).join(' | ');

  return (
    <Head>
      <title key="title">{titleText}</title>
      <meta key="description" name="description" content={description} />
      <meta name="author" content={name} />

      <meta property="og:title" content={titleText} />
      <meta property="og:site_name" content={name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:description" content={description} />
    </Head>
  );
};
