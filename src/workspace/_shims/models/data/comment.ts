export default interface CommentElementData {
  opened: boolean;
  task?: {
    assignee: number | null;
    date: number | null;
    completed: boolean;
    reminder: number | null;
  };
  attached: {
    uid: string | null;
  };
  style: {
    background: string | null;
  };
}
