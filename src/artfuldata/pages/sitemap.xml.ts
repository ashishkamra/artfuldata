import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const pages = ['', 'visualisation/', 'analytics/', 'analytics/ceg/', 'community/', 'woodworking/', 'about/'];
  const urls = pages.map(path => `<url><loc>${new URL(`${import.meta.env.BASE_URL}${path}`, site).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
