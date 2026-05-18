import { ImageResponse } from '@vercel/og';
import { supabaseServer } from '../../lib/supabase-server';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  const { data: project } = await supabaseServer
    .from('projects')
    .select('title, description_en, tags, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  const title = project?.title ?? 'Project';
  const description = project?.description_en ?? '';
  const tags: string[] = project?.tags ?? [];

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
          padding: '72px 80px',
          background: '#0a0a0a',
          fontFamily: 'sans-serif',
          position: 'relative',
        },
        children: [
          // Glow blob
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
              },
            },
          },
          // Back label
          {
            type: 'div',
            props: {
              style: {
                fontSize: '18px',
                color: '#4ade80',
                marginBottom: '28px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              },
              children: 'Michel Encarnación — Project',
            },
          },
          // Accent line
          {
            type: 'div',
            props: {
              style: {
                width: '48px',
                height: '4px',
                background: '#4ade80',
                borderRadius: '2px',
                marginBottom: '28px',
              },
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: {
                fontSize: '64px',
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: '1.1',
                marginBottom: '24px',
                letterSpacing: '-1px',
                maxWidth: '900px',
              },
              children: title,
            },
          },
          // Description
          description
            ? {
                type: 'div',
                props: {
                  style: {
                    fontSize: '24px',
                    color: '#a3a3a3',
                    marginBottom: '36px',
                    maxWidth: '860px',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  },
                  children: description,
                },
              }
            : { type: 'div', props: { style: {}, children: '' } },
          // Tags
          tags.length > 0
            ? {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
                  children: tags.slice(0, 5).map((tag) => ({
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
              }
            : { type: 'div', props: { style: {}, children: '' } },
          // Domain
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '48px',
                right: '80px',
                fontSize: '18px',
                color: '#404040',
              },
              children: 'micheldev.vercel.app',
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 }
  );
};
