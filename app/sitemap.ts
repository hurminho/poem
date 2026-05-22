import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const paths = [
    "",
    "/today",
    "/recommend",
    "/pricing",
    "/explore",
    "/login",
    "/signup",
    "/beta",
    "/brand",
    "/legal/terms",
    "/legal/privacy",
    "/legal/copyright",
    "/legal/community",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/legal") ? 0.3 : 0.7,
  }));
}
