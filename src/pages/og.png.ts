import { ImageResponse } from '@vercel/og';

export const prerender = false;

export async function GET() {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0a',
          fontFamily: 'sans-serif',
          position: 'relative',
        },
        children: [
          // Green glow blob
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
              },
            },
          },
          // Accent line
          {
            type: 'div',
            props: {
              style: {
                width: '64px',
                height: '4px',
                background: '#4ade80',
                borderRadius: '2px',
                marginBottom: '32px',
              },
            },
          },
          // Name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: '1.1',
                marginBottom: '20px',
                letterSpacing: '-1px',
              },
              children: 'Michel Encarnación',
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '28px',
                color: '#4ade80',
                fontWeight: '500',
                marginBottom: '40px',
              },
              children: 'Software Engineering Student & Full-Stack Developer',
            },
          },
          // Tags row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '12px',
              },
              children: ['React', 'TypeScript', 'Node.js', 'Astro'].map((tag) => ({
                type: 'div',
                props: {
                  style: {
                    padding: '6px 18px',
                    borderRadius: '999px',
                    border: '1px solid rgba(74,222,128,0.3)',
                    color: '#4ade80',
                    fontSize: '18px',
                  },
                  children: tag,
                },
              })),
            },
          },
          // Bottom url
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '48px',
                right: '80px',
                fontSize: '20px',
                color: '#525252',
              },
              children: 'micheldev.vercel.app',
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
}
