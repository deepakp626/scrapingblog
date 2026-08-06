// src/Tiptap.tsx
import { useState, ReactNode } from "react"
import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react'
import { FloatingMenu, BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from "@tiptap/extension-link";
import { Toggle } from "@/components/ui/toggle"
import { BoldIcon, CodeIcon, HighlighterIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, Quote, RedoIcon, StrikethroughIcon, UnderlineIcon, UndoIcon, UnlinkIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Tiptap = ({ content, onChange }: { content?: string, onChange?: (value: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight.configure({ multicolor: true }), Link.configure({
      HTMLAttributes: {
        class: "text-blue-600 underline hover:text-blue-700",
      },
    }),], // define your extension array
    
    // es editor prop Ka throw OR tailwind class ka throw jo bhe toolbar ko jo style dhane hothe hai vo add kar saktha hu 
    editorProps: {
      attributes: {
        class:
        "prose  prose-sm sm: prose-base focus: outline-none max-w-none",
      },
    },
    content: content || '<p> Hello World! </p>', // initial content
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

  })

  return (
    <>
      {
        editor && (
          <>
              {/* Toolbar */}
    <div
        className="
        sticky
        top-0
        z-50
        bg-white
        border-b
        p-2
        flex
        flex-wrap
        gap-2
        "
    >
        <ToolBar editor={editor} />
    </div>
          
           <BubbleMenu editor={editor}> </BubbleMenu> 
          </>
        )
      }

      {/* ya editor content important hai esma editot object pass kiya hai */}
      <EditorContent className="text-black h-40 mt-5" editor={editor} />




      {/* <FloatingMenu editor={editor}> |</FloatingMenu>
      <BubbleMenu editor={editor}> </BubbleMenu> */}
    </>
  )
}

export default Tiptap


const ToolBar = ({ editor }: { editor: Editor }) => {

  const editorState = useEditorState({
    editor, selector: (context) => {

      return {
        isBold: context.editor.isActive("bold") ?? false,
        isItalic: context.editor.isActive("italic") ?? false,
        isUnderline: context.editor.isActive("underline") ?? false,
        isStrike: context.editor.isActive("strike") ?? false,
        isHighlight: context.editor.isActive('highlight') ?? false,
        isCode: context.editor.isActive("code") ?? false,
        isBulletList: context.editor.isActive("bulletList") ?? false,
        isOrderedList: context.editor.isActive("orderedList") ?? false,
        isBlockquote: context.editor.isActive("blockquote") ?? false,
        isLink: context.editor.isActive("link") ?? false,
        canRedo: editor.can().redo(),
        canUndo: editor.can().undo(),
        isHeading2: context.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: context.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: context.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: context.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: context.editor.isActive("heading", { level: 6 }) ?? false,
        isParagraph: context.editor.isActive("paragraph") ?? false,
      }
    }
  })

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = Number.parseInt(value.replace("heading", "")) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;
      editor.chain().focus().setHeading({ level }).run();
    }
  }

  return (
    <>

      <div className="sticky top-0 z-30 flex flex-wrap items-center gap-1.5 " >
        
        <Select
          onValueChange={handleHeadingChange}
          value={
            editorState.isHeading2
            ? "heading2"
            : editorState.isHeading3
                ? "heading3"
                : editorState.isHeading4
                  ? "heading4"
                  : editorState.isHeading5
                    ? "heading5"
                    : editorState.isHeading6
                    ? "heading6"
                      : "paragraph"

          }
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a heading" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="heading1">Heading 1</SelectItem>
            <SelectItem value="heading2">Heading 2</SelectItem>
              <SelectItem value="heading3">Heading 3</SelectItem>
              <SelectItem value="heading4">Heading 4</SelectItem>
              <SelectItem value="heading5">Heading 5</SelectItem>
              <SelectItem value="heading6">Heading 6</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          pressed={editorState.isBold}
        >
          <BoldIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          pressed={editorState.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          pressed={editorState.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label="Toggle strikethrough"
          pressed={editorState.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >  <StrikethroughIcon className="h-4 w-4" />

        </Toggle>


        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isHighlight}
          onPressedChange={() =>
            editor.chain().focus().toggleHighlight({ color: "#fdeb80" }).run()
          }
          aria-label="Toggle highlight"
        >
          <HighlighterIcon className="h-4 w-4" />
        </Toggle>


        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isCode}
          onPressedChange={(() => editor.chain().focus().toggleCode().run())}
          aria-label="Toggle code"
        >
          <CodeIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isBulletList}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list" >
          <ListIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isOrderedList}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list">
          <ListOrderedIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isBlockquote}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote">
          <Quote className="h-4 w-4" />
        </Toggle>


        {editorState.isLink ? (<Toggle
          pressed
          variant='outline'
          onPressedChange={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          aria-label="Toggle link">
          <UnlinkIcon className="h-4 w-4" />
        </Toggle >
        ) : (<LinkComponent editor={editor}>
          <Toggle size="sm" aria-label="Toggle link">
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
        )}

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          aria-label="Undo" >
          <UndoIcon className="h-4 w-4" />
        </Button >


        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          aria-label="Redo" >
          <RedoIcon className="h-4 w-4" />
        </Button >






        {/* <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editorState.isBold  ? 'is-active' : ''}
        >
          Bold
        </button> */}
  </div>
      </>
    )
}

function LinkComponent({ editor, children, }: { editor: Editor; children: ReactNode; }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setIsLinkPopoverOpen(false);
    setLinkUrl("");
  };

  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      {/* // this is the main */}
      {/* trigger point */}
      <PopoverContent className="w-80 p-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium">Insert Link</h3>
          <Input
            placeholder="https://example.com"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetLink();
              }
            }}

          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsLinkPopoverOpen(false)} >
              Cancel
            </Button>
            <Button onClick={() => handleSetLink()}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>

  );
}


const BubbleMenu = ({editor}: {editor: Editor}) => {
  const editorState = useEditorState({
    editor,
    selector: (context) => ({
      isBold: context.editor.isActive("bold") ?? false,
        isItalic: context.editor.isActive("italic") ?? false,
        isUnderline: context.editor.isActive("underline") ?? false,
        isStrike: context.editor.isActive("strike") ?? false,
        isHighlight: context.editor.isActive('highlight') ?? false,
        isCode: context.editor.isActive("code") ?? false,
        isBulletList: context.editor.isActive("bulletList") ?? false,
        isOrderedList: context.editor.isActive("orderedList") ?? false,
        isBlockquote: context.editor.isActive("blockquote") ?? false,
        isLink: context.editor.isActive("link") ?? false,
        
    })
  })

  return (
    <>
    <TiptapBubbleMenu editor={editor}>
        
                 <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          pressed={editorState.isBold}
        >
          <BoldIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          pressed={editorState.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label='Toggle bookmark'
          pressed={editorState.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />

        </Toggle>

        <Toggle
          size="sm"
          variant="outline"
          aria-label="Toggle strikethrough"
          pressed={editorState.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >  <StrikethroughIcon className="h-4 w-4" />

        </Toggle>


        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isHighlight}
          onPressedChange={() =>
            editor.chain().focus().toggleHighlight({ color: "#fdeb80" }).run()
          }
          aria-label="Toggle highlight"
        >
          <HighlighterIcon className="h-4 w-4" />
        </Toggle>


        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isCode}
          onPressedChange={(() => editor.chain().focus().toggleCode().run())}
          aria-label="Toggle code"
        >
          <CodeIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isBulletList}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list" >
          <ListIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isOrderedList}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list">
          <ListOrderedIcon className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          variant='outline'
          pressed={editorState.isBlockquote}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote">
          <Quote className="h-4 w-4" />
        </Toggle>


        {editorState.isLink ? (<Toggle
          pressed
          variant='outline'
          onPressedChange={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          aria-label="Toggle link">
          <UnlinkIcon className="h-4 w-4" />
        </Toggle >
        ) : (<LinkComponent editor={editor}>
          <Toggle size="sm" aria-label="Toggle link">
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </LinkComponent>
        )}

      </TiptapBubbleMenu>
    </>
  )
}