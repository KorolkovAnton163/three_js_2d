export interface GroupElementTitle {
  enabled: boolean;
  value: string | null;
}

export default interface GroupElementData {
  title: GroupElementTitle;
  attached: string[];
}
