export interface ToDoElementTitle {
  enabled: boolean;
  value: string | null;
}

export interface ToDoElementItem {
  uid: string;
  checked: boolean;
  value: string | null;
}

export default interface ToDoElementData {
  title: ToDoElementTitle;
  items: ToDoElementItem[];
}
