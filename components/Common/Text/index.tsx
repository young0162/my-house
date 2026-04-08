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
  const style: CSSProperties = {
    ...(fontSize !== undefined && { fontSize }),
    ...(color !== undefined && { color }),
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
