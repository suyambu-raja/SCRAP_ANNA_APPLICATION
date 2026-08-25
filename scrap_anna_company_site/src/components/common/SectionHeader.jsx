import React from 'react';

export default function SectionHeader({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  centered = true,
  dark = false,
  className = ''
}) {
  // If highlightWord is provided, split the title and wrap the highlightWord
  let renderedTitle = title;
  if (highlightWord && typeof title === 'string' && title.includes(highlightWord)) {
    const parts = title.split(highlightWord);
    renderedTitle = (
      <>
        {parts[0]}
        <span className="text-yellow-highlight">{highlightWord}</span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  }

  return (
    <div className={`section-header ${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <div className="section-eyebrow">
          <span className={`badge ${dark ? 'badge-dark' : 'badge-yellow'}`}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="section-title" style={{ color: dark ? 'var(--color-white)' : undefined }}>
        {renderedTitle}
      </h2>
      {subtitle && (
        <p 
          className="section-subtitle" 
          style={{ color: dark ? '#D1D5DB' : undefined }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
