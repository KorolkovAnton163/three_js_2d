import ArrowElementData from "./arrow";
import CommentElementData from "./comment";
import FileElementData from "./file";
import GoogleDocumentElementData from "./google";
import GroupElementData from "./group";
import LinkElementData from "./link";
import NoteElementData from "./note";
import ToDoElementData from "./todo";
import SlideshowElementData from "./slideshow";
import DraggableElementData from "./draggable";

export type ElementData = ArrowElementData
  | CommentElementData
  | FileElementData
  | GoogleDocumentElementData
  | GroupElementData
  | LinkElementData
  | NoteElementData
  | ToDoElementData
  | SlideshowElementData
  | DraggableElementData;
