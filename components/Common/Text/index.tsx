import { CSSProperties, ReactNode } from "react";

type TextTag =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "strong"
  | "em"
  | "small"
  | "b"
  | "i"
  | "u"
  | "s"
  | "abbr"
  | "cite"
  | "code"
  | "label";

type TextColor = "#222" | "#333" | "#444";

interface TextProps {
  children: ReactNode;
  tag?: TextTag;
  fontSize?: number;
  color?: TextColor;
  lineHeight?: CSSProperties["lineHeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
  fontWeight?: CSSProperties["fontWeight"];
}

export default function Text({
  children,
  tag: Tag = "span",
  fontSize = 14,
  color = "#222",
  lineHeight,
  letterSpacing,
  fontWeight,
}: TextProps) {
  return (
    <Tag style={{ fontSize, color, lineHeight, letterSpacing, fontWeight }}>
      {children}
    </Tag>
  );
}
