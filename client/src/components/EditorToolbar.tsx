"use client";
import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough as StrikeIcon,
  Link as LinkIcon,
  Braces,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
const pastedComponents = [
  "username",
  "first_name",
  "last_name",
  "is_premium",
  "is_bot",
  "id",
];
export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);
  const insertVariable = (variable: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`{{${variable}}}`).run();
    }
  };
  const insertEmoji = (variable: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`${variable}`).run();
    }
  };
  if (!editor) return null;
  return (
    <div className="flex items-center p-2 justify-between flex-wrap">
      <Popover open={openEmoji} onOpenChange={setOpenEmoji}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            className="bg-transparent border-none"
          >
            <Smile />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <EmojiPicker
            lazyLoadEmojis={true}
            onEmojiClick={(emoji) => {
              insertEmoji(emoji.emoji);
            }}
          />
        </PopoverContent>
      </Popover>
      {/*<Popover open={open} onOpenChange={setOpen}>*/}
      {/*  <PopoverTrigger asChild>*/}
      {/*    <Button*/}
      {/*      variant="outline"*/}
      {/*      role="combobox"*/}
      {/*      size="sm"*/}
      {/*      className="bg-transparent border-none"*/}
      {/*    >*/}
      {/*      <Braces />*/}
      {/*    </Button>*/}
      {/*  </PopoverTrigger>*/}
      {/*  <PopoverContent className="w-[200px] p-0">*/}
      {/*    <Command>*/}
      {/*      <CommandList>*/}
      {/*        <CommandGroup>*/}
      {/*          {pastedComponents.map((comp) => (*/}
      {/*            <CommandItem*/}
      {/*              key={comp}*/}
      {/*              value={comp}*/}
      {/*              onSelect={(currentValue) => {*/}
      {/*                setOpen(false);*/}
      {/*                insertVariable(comp);*/}
      {/*              }}*/}
      {/*            >*/}
      {/*              {comp}*/}
      {/*            </CommandItem>*/}
      {/*          ))}*/}
      {/*        </CommandGroup>*/}
      {/*      </CommandList>*/}
      {/*    </Command>*/}
      {/*  </PopoverContent>*/}
      {/*</Popover>*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <BoldIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <ItalicIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikeIcon />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={() => {
          const url = prompt("Enter URL");
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run();
          } else {
            editor.chain().focus().unsetLink().run();
          }
        }}
      >
        <LinkIcon />
      </Toggle>
    </div>
  );
}
