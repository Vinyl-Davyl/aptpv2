import { useMonaco } from "@monaco-editor/react";
import { lazy, Suspense, useCallback, useEffect } from "react";
import * as monaco from "monaco-editor";
import useAppStore from "../store/store";

const MonacoEditor = lazy(() => import("@monaco-editor/react").then((mod) => ({ default: mod.Editor })));

const concertoKeywords = [
  "map",
  "concept",
  "from",
  "optional",
  "default",
  "range",
  "regex",
  "length",
  "abstract",
  "namespace",
  "import",
  "enum",
  "scalar",
  "extends",
  "default",
  "participant",
  "asset",
  "o",
  "identified by",
  "transaction",
  "event",
];

const concertoTypes = ["String", "Integer", "Double", "DateTime", "Long", "Boolean"];

const handleEditorWillMount = (monacoInstance: typeof monaco) => {
  monacoInstance.languages.register({
    id: "concerto",
    extensions: [".cto"],
    aliases: ["Concerto", "concerto"],
    mimetypes: ["application/vnd.accordproject.concerto"],
  });

  monacoInstance.languages.setMonarchTokensProvider("concerto", {
    keywords: concertoKeywords,
    typeKeywords: concertoTypes,
    operators: ["=", "{", "}", "@", '"'],
    symbols: /[=}{@"]+/,
    escapes: /\\(?:[btnfru"'\\]|\\u[0-9A-Fa-f]{4})/,
    tokenizer: {
      root: [
        { include: "@whitespace" },
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@typeKeywords": "type",
              "@default": "identifier",
            },
          },
        ],
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
        [/"/, "string", "@string"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"],
      ],
      whitespace: [
        [/\s+/, "white"],
        [/(\/\/.*)/, "comment"],
      ],
    },
  });
};

interface ConcertoEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
}

export default function ConcertoEditor({ value, onChange }: ConcertoEditorProps) {
  const monacoInstance = useMonaco();
  const error = useAppStore((state) => state.error);
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const ctoErr = error?.startsWith("c:") ? error : undefined;

  // Determine theme based on background color
  const isDarkMode = backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a";
  const themeName = isDarkMode ? "darkTheme" : "lightTheme";

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.editor.defineTheme("lightTheme", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "cd2184" },
          { token: "type", foreground: "008080" },
          { token: "identifier", foreground: "000000" },
          { token: "string", foreground: "008000" },
          { token: "string.escape", foreground: "800000" },
          { token: "comment", foreground: "808080" },
          { token: "white", foreground: "FFFFFF" },
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editor.lineHighlightBorder": "#b3c7e6",
        },
      });

      monacoInstance.editor.defineTheme("darkTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "ff79c6" },
          { token: "type", foreground: "8be9fd" },
          { token: "identifier", foreground: "f8f8f2" },
          { token: "string", foreground: "50fa7b" },
          { token: "string.escape", foreground: "ff5555" },
          { token: "comment", foreground: "6272a4" },
          { token: "white", foreground: "f8f8f2" },
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#ffffff",
          "editor.lineHighlightBorder": "#2a3a5f",
        },
      });

      // Apply the selected theme dynamically
      monacoInstance.editor.setTheme(themeName);
    }
  }, [monacoInstance, themeName]);

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    wordWrap: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
  };

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (onChange) onChange(val);
    },
    [onChange]
  );

  useEffect(() => {
    if (!monacoInstance) return;

    const model = monacoInstance.editor.getModels()?.[0];
    if (!model) return;

    if (ctoErr) {
      const match = ctoErr.match(/Line (\d+) column (\d+)/);
      if (match) {
        const lineNumber = parseInt(match[1], 10);
        const columnNumber = parseInt(match[2], 10);
        monacoInstance.editor.setModelMarkers(model, "customMarker", [
          {
            startLineNumber: lineNumber,
            startColumn: columnNumber - 1,
            endLineNumber: lineNumber,
            endColumn: columnNumber + 1,
            message: ctoErr,
            severity: monaco.MarkerSeverity.Error,
          },
        ]);
      }
    } else {
      monacoInstance.editor.setModelMarkers(model, "customMarker", []);
    }
  }, [ctoErr, monacoInstance]);

  return (
    <div className="editorwrapper">
      <Suspense fallback={<div>Loading Editor...</div>}>
        <MonacoEditor
          options={options}
          language="concerto"
          height="60vh"
          value={value}
          onChange={handleChange}
          beforeMount={handleEditorWillMount}
          theme={themeName}
        />
      </Suspense>
    </div>
  );
}
