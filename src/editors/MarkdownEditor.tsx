import { lazy, Suspense, useCallback, useEffect } from "react";
import useAppStore from "../store/store";
import { useMonaco } from "@monaco-editor/react";

const MonacoEditor = lazy(() => import("@monaco-editor/react").then((mod) => ({ default: mod.Editor })));

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string | undefined) => void;
}) {
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const monaco = useMonaco();

  // Determine theme based on background color
  const isDarkMode = backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a";
  const themeName = isDarkMode ? "darkTheme" : "lightTheme";

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("lightTheme", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editor.lineHighlightBorder": "#b3c7e6",
        },
      });

      monaco.editor.defineTheme("darkTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#ffffff",
          "editor.lineHighlightBorder": "#2a3a5f",
        },
      });

      // Apply the selected theme dynamically
      monaco.editor.setTheme(themeName);
    }
  }, [monaco, themeName]);

  const editorOptions = {
    minimap: { enabled: false },
    wordWrap: "on" as const,
    automaticLayout: true,
    scrollBeyondLastLine: false,
  };

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (onChange) onChange(val);
    },
    [onChange]
  );

  return (
    <div className="editorwrapper">
      <Suspense fallback={<div>Loading Editor...</div>}>
        <MonacoEditor
          options={editorOptions}
          language="markdown"
          height="60vh"
          value={value}
          onChange={handleChange}
          theme={themeName}
        />
      </Suspense>
    </div>
  );
}
