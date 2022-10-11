export interface LinkElementField {
  value: string | null;
  enabled: boolean;
}

export interface LinkElementInfo {
  description: LinkElementField;
  code: {
    html: string | null;
    height: number | null;
    width: number | null;
    ratio: number | null;
  } | null;
  icon: string | null;
  image: string | null;
  link: string | null;
  title: LinkElementField;
  preview?: string;
}

export default interface LinkElementData {
  info?: LinkElementInfo;
  preview?: boolean;
  parse?: string;
  remote?: boolean;
  viewer?: {
    id: number;
    type: string;
  };
  default?: { w: number; h: number };
}
