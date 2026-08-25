import { useEffect } from 'react';

export default function SEO({ 
  title = "Scrap Anna | Connect • Collect • Recycle", 
  description = "Scrap Anna is India's trusted digital scrap marketplace connecting households, merchants and industries for transparent transactions and fair prices.",
  keywords = "scrap collection, scrap recycling, scrap dealer, scrap pickup, scrap marketplace, industrial scrap, scrap recycling Chennai",
  canonical
}) {
  useEffect(() => {
    // Update Document Title
    document.title = title ? `${title} | Scrap Anna` : "Scrap Anna | Connect • Collect • Recycle";
    
    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
    }

    // Canonical link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', canonical);
    }
  }, [title, description, keywords, canonical]);

  return null;
}
