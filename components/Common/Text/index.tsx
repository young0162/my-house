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

type TextColor = "gray01" | "primary";

interface TextProps {
  children: ReactNode;
  tag?: TextTag;
  fontSize?: number;
  color?: TextColor;
  lineHeight?: CSSProperties["lineHeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
  fontWeight?: CSSProperties["fontWeight"];
  className?: string;
}

const Text = ({
  children,
  tag: Tag = "span",
  fontSize,
  color,
  lineHeight,
  letterSpacing,
  fontWeight,
  className,
}: TextProps) => {
  const COLOR_MAP: Record<string, string> = {
    primary: "var(--color-primary, #00A1FF)",
    gray01: "var(--color-text-primary, #2f3438)",
  };

  const resolvedColor = color !== undefined ? (COLOR_MAP[color] ?? color) : undefined;

  const style: CSSProperties = {
    ...(fontSize !== undefined && { fontSize }),
    ...(resolvedColor !== undefined && { color: resolvedColor }),
    ...(lineHeight !== undefined && { lineHeight }),
    ...(letterSpacing !== undefined && { letterSpacing }),
    ...(fontWeight !== undefined && { fontWeight }),
  };

  return (
    <Tag style={style} className={className}>
      {children}
    </Tag>
  );
};

export default Text;
