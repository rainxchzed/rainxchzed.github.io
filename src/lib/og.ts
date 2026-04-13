import satori from 'satori';
import sharp from 'sharp';

// Cache the font so we only fetch once per build
let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  // Satori supports TTF/OTF/WOFF but NOT WOFF2. Fetch Inter Bold as WOFF.
  const res = await fetch(
    'https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff',
  );
  if (!res.ok) {
    // Fallback: fetch from Google Fonts (user-agent trick to get TTF)
    const cssRes = await fetch(
      'https://fonts.googleapis.com/css2?family=Inter:wght@700',
      { headers: { 'User-Agent': 'Mozilla/5.0 Firefox/1.0' } },
    );
    const css = await cssRes.text();
    const match = css.match(/url\(([^)]+)\)/);
    if (match?.[1]) {
      const fontRes = await fetch(match[1]);
      fontCache = await fontRes.arrayBuffer();
      return fontCache;
    }
    throw new Error('Failed to fetch Inter font for OG images');
  }
  fontCache = await res.arrayBuffer();
  return fontCache;
}

export async function generateOGImage(
  title: string,
  subtitle?: string,
): Promise<Buffer> {
  const fontData = await getFont();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 100%)',
          padding: '64px',
          fontFamily: 'Inter',
        },
        children: [
          // Top: title + subtitle
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                flex: '1',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 50 ? '42px' : '52px',
                      fontWeight: 700,
                      color: '#fafafa',
                      lineHeight: 1.2,
                      letterSpacing: '-0.025em',
                      maxWidth: '950px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: title,
                  },
                },
                ...(subtitle
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: '#a3a3a3',
                            lineHeight: 1.5,
                            maxWidth: '800px',
                          },
                          children: subtitle,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Bottom: branding bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                // Left: site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    },
                    children: [
                      // Cat icon (simplified)
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background:
                              'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '20px',
                                lineHeight: 1,
                              },
                              children: '🐱',
                            },
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#38bdf8',
                            letterSpacing: '-0.01em',
                          },
                          children: 'rainxchzed.dev',
                        },
                      },
                    ],
                  },
                },
                // Right: tagline
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#737373',
                    },
                    children: 'Android & KMP developer',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal' as const,
        },
      ],
    },
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
