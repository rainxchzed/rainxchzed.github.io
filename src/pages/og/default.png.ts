import { generateOGImage } from '../../lib/og';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const png = await generateOGImage(
    'rainxchzed',
    '16 y/o Android & KMP developer with big ambitions. Building things non-tech users can use with ease.',
  );

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
