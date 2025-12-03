import createDOMPurify, { type Config as DOMPurifyConfig } from "dompurify";
import { JSDOM } from "jsdom";

type SanitizeConfig = DOMPurifyConfig & { KEEP_CONTENT?: boolean };

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window as any);

const SAFE_HTML_TAGS = [
  "a",
  "p",
  "br",
  "strong",
  "em",
  "u",
  "span",
  "div",
  "blockquote",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
] as const;

const SAFE_HTML_ATTRIBUTES = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "loading",
  "srcset",
  "sizes",
  "class",
] as const;

const DEFAULT_CONFIG: SanitizeConfig = {
  USE_PROFILES: { html: true },
  SANITIZE_DOM: true,
  ALLOWED_TAGS: [...SAFE_HTML_TAGS],
  ALLOWED_ATTR: [...SAFE_HTML_ATTRIBUTES],
  ADD_ATTR: ["srcset", "sizes", "loading"],
  ALLOWED_URI_REGEXP:
    /^(?:(?:https?|mailto|tel|ftp|data:image\/(?:png|jpe?g|gif|webp));|[^a-z]|[a-z+\.-]+(?:[^a-z+\.-:]|$))/i,
};

/**
 * Normalize and sanitize arbitrary HTML fragments emitted by the admin editor.
 * @param dirty Raw HTML string that might contain unsafe markup.
 * @param config Optional DOMPurify configuration overrides.
 */
export function sanitizeHtml(dirty: string, config?: SanitizeConfig): string {
  if (!dirty) {
    return "";
  }
  return DOMPurify.sanitize(dirty, { ...DEFAULT_CONFIG, ...config });
}

/**
 * Strip all HTML markup while keeping the original text content.
 * @param dirty Raw HTML string that might contain unsafe markup.
 */
export function stripHtml(dirty: string): string {
  return sanitizeHtml(dirty, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
}
