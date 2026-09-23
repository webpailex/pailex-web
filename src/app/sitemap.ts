import type { MetadataRoute } from "next";
import { SITE_URL, getPageRoutes, getSolutions, getPosts } from "@/lib/api";

/**
 * Genera /sitemap.xml automáticamente (convención de Next.js, sin paquete
 * extra). Usa el slug PÚBLICO actual de cada página (vía getPageRoutes,
 * el mismo mapa que usa el middleware) para no quedar desactualizado si el
 * gestor renombra una URL. Si el CMS no responde, el sitio sigue sirviendo
 * el sitemap con solo las rutas fijas conocidas, en vez de fallar el build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const routes = await getPageRoutes();
    for (const route of routes) {
      if (route.template === "home") continue;
      staticEntries.push({
        url: `${SITE_URL}/${route.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Sin conexión al CMS: se omiten las páginas dinámicas, no se rompe el sitemap.
  }

  let solutionEntries: MetadataRoute.Sitemap = [];
  try {
    const solutions = await getSolutions();
    solutionEntries = solutions.map((solution) => ({
      url: `${SITE_URL}/soluciones/${solution.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Idem.
  }

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    postEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.published_at ?? undefined,
      changeFrequency: "yearly",
      priority: 0.5,
    }));
  } catch {
    // Idem.
  }

  return [...staticEntries, ...solutionEntries, ...postEntries];
}
