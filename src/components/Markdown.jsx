'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const renderer = {
  heading(text, level) {
    const lvl = Math.min(Math.max(level, 3), 6);
    return `<h${lvl}>${text}</h${lvl}>`;
  },
  hr() {
    return '<div style="text-align: center; margin: 1rem;">§</div>';
  },
};

marked.use({ renderer });

export default function Markdown({ markdown }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const displayMarkdown = async () => {
      if (typeof window !== 'undefined') {
        const sanitized = DOMPurify.sanitize(markdown);
        const rawHtml = await marked.parse(sanitized);
        setHtml(rawHtml);
      }
    };
    displayMarkdown();
  }, [markdown]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
