const enum MouseButton {
    LEFT = 0,
  }
  
  export default class {
    public static isLeftButtonPressed(e: MouseEvent): boolean {
      return e.buttons === 1 && e.button === MouseButton.LEFT;
    }
  
    public static isCtrlButtonPressed(e: MouseEvent): boolean {
      return e.ctrlKey;
    }
  
    public static isSelectionInteract(e: MouseEvent): boolean {
      const isMac = Boolean(navigator.userAgent.match('Mac'));
  
      return isMac ? e.metaKey : e.ctrlKey;
    }
  }