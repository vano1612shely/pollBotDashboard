"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "@/components/EditorToolbar";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import { Node } from "@tiptap/core";
import { useEffect } from "react";
const ReplaceParagraphWithBr = Node.create({
  name: "paragraph",

  group: "block",

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "p",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", HTMLAttributes, 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setHardBreak(),
    };
  },
});

const TextEditor = ({
  content,
  setContent,
  isLoaded = true,
}: {
  content: string;
  isLoaded?: boolean;
  setContent: (text: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Bold,
      Italic,
      Underline,
      Strike,
      Link,
      ReplaceParagraphWithBr,
    ],
    content: content || "",
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "h-[250px] overflow-y-auto p-2 outline-none border-b",
      },
    },
  });
  useEffect(() => {
    console.log(content);
    editor?.commands.setContent(content || "");
  }, [isLoaded]);
  return (
    <div className="min-h-[250px] rounded-xl border">
      <EditorContent editor={editor} />
      <EditorToolbar editor={editor} />
    </div>
  );
};

export default TextEditor;
