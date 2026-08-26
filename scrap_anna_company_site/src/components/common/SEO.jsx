import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = "https://scrapanna.com";
const DEFAULT_IMAGE = "https://scrapanna.com/og-image.jpg";

export default function SEO({ 
  title, 
  description = "Scrap Anna connects households, scrap merchants, and industrial enterprises in Chennai, Tamil Nadu on one digital platform for transparent transactions, fair prices, and eco-friendly recycling.",
  keywords = "scrap collection, scrap recycling, scrap dealer Chennai, scrap pickup, scrap marketplace, industrial scrap Tamil Nadu, sell scrap online, fair scrap prices",
  canonical,
  noindex = false,
  robots
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Format Document Title cleanly (avoiding "Scrap Anna | Scrap Anna")
    let finalTitle = "Scrap Anna | Connect • Collect • Recycle";
    if (title) {
      if (title.includes("Scrap Anna")) {
        finalTitle = title;
      } else {
        finalTitle = `${title} | Scrap Anna`;
      }
    }
    document.title = finalTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrName.trim(), attrVal.replace(/"/g, '').trim());
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);
    setMetaTag('meta[name="title"]', 'content', finalTitle);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // 3. Robots Meta Tag (handling noindex for 404 pages)
    const robotsContent = robots || (noindex ? "noindex, nofollow" : "index, follow");
    setMetaTag('meta[name="robots"]', 'content', robotsContent);

    // 4. Canonical Tag
    const currentPath = location.pathname === '/' ? '' : location.pathname;
    const finalCanonical = canonical || `${SITE_ORIGIN}${currentPath}`;
    
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', finalCanonical);

    // 5. Open Graph Metadata
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', finalCanonical);
    setMetaTag('meta[property="og:type"]', 'content', 'website');
    setMetaTag('meta[property="og:image"]', 'content', DEFAULT_IMAGE);

    // 6. Twitter / X Card Metadata
    setMetaTag('meta[property="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[property="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[property="twitter:description"]', 'content', description);
    setMetaTag('meta[property="twitter:url"]', 'content', finalCanonical);
    setMetaTag('meta[property="twitter:image"]', 'content', DEFAULT_IMAGE);

  }, [title, description, keywords, canonical, noindex, robots, location.pathname]);

  return null;
}
