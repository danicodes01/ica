'use client';

import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import type { Monaco } from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onCodeSubmit?: (code: string) => Promise<void>;
}

// Define Monokai theme
const claudeTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' },  // purple for keywords
    { token: 'string', foreground: '9CDCFE' },   // light blue
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },     // teal for types
    { token: 'identifier', foreground: '9CDCFE' },// light blue for variables
    { token: 'function', foreground: '4FC1FF' },  // bright blue for functions
    { token: 'operator', foreground: 'D4D4D4' },  // light grey for operators
    { token: 'delimiter', foreground: 'D4D4D4' }, // light grey for delimiters
    { token: 'variable', foreground: '9CDCFE' },  // light blue for variables
    { token: 'constant', foreground: '4FC1FF' },  
  ],
  colors: {
    'editor.background': '#1E1E1E',              // darker background
    'editor.foreground': '#D4D4D4',              // light grey text
    'editor.lineHighlightBackground': '#2F2F2F',  // slightly lighter for current line
    'editor.selectionBackground': '#264F78',      // blue selection
    'editorCursor.foreground': '#FFFFFF',         // white cursor
    'editor.selectionHighlightBackground': '#264F78',
    'editorLineNumber.foreground': '#858585',     // grey line numbers
    'editorIndentGuide.background': '#404040',  
  },
};

export default function CodeEditor({
  initialCode = '// Start coding here',
  language,
  height = '40vh',
  readOnly = false,
  onCodeSubmit,
}: CodeEditorProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  useEffect(() => {
    console.log("language set", language)
  }, [language])
  console.log("language set",language)
  const beforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('claude', claudeTheme);
  
    // Configure TypeScript (and JavaScript)
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,  // This allows JavaScript files in TypeScript context
      typeRoots: ["node_modules/@types"],
      lib: ["ESNext", "DOM"],
      strict: true,
    });
  
    // Ensure diagnostics are enabled
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
    });
  
    // Add extra global libs for JavaScript/TypeScript if needed
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      interface Console {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
      }
      declare const console: Console;
      `,
      'global.d.ts'
    );
  
    // Add Python support (assuming you're adding support for Python manually)
    monaco.languages.register({ id: 'python' });
    monaco.languages.setMonarchTokensProvider('python', {
      tokenizer: {
        root: [
          [/\b(?:def|class)\b/, 'keyword'],
          [/[A-Za-z_]\w*/, 'identifier'],
          [/\b\d+\b/, 'number'],
          [/'[^']*'/, 'string'],
          [/"[^"]*"/, 'string'],
          [/[#].*/, 'comment'],
        ]
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (onCodeSubmit) {
        await onCodeSubmit(code);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExecuting(true);

    try {
      await executeCode(code);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult('An unknown error occurred');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const executeCode = async (codeToExecute: string): Promise<void> => {
    try {
      // Clear previous logs
      setLogs([]);
      const logMessages: string[] = [];

      // Create a custom console object for the execution context
      const customConsole = {
        log: (...args: unknown[]) => {
          const logMessage = args
            .map(arg =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
            )
            .join(' ');
          logMessages.push(logMessage);
          console.log(...args);
        },
      };

      // Execute the code in a try-catch block
      try {
        // Create a new Function with custom console
        const executedFunction = new Function('console', codeToExecute);
        const result = executedFunction(customConsole);

        // Update logs with captured console.log output
        setLogs(logMessages);

        // If the code returns a value, add it to the logs
        if (result !== undefined) {
          logMessages.push(`Return value: ${result}`);
        }

        setResult('');
      } catch (execError) {
        throw new Error(
          `Runtime error: ${
            execError instanceof Error ? execError.message : 'Unknown error'
          }`,
        );
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.editorWrapper}>
          <Editor
            height={height}
            defaultLanguage={language}
            value={code}
            onChange={handleEditorChange}
            beforeMount={beforeMount}
            theme='claude'
           options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 21,
                  fontFamily: 'Fira Code, monospace',
                  fontWeight: '400',
                  fontLigatures: true,
                  padding: { top: 30 },
                  scrollBeyondLastLine: false,
                  folding: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'none',
                  matchBrackets: 'always',
                  cursorStyle: 'block',
                  cursorBlinking: 'smooth',
                  formatOnPaste: true,
                  roundedSelection: false,
                  formatOnType: true,
                  tabSize: 2,
                  autoIndent: 'advanced',
                  readOnly,
                  guides: {
                    indentation: true,
                    bracketPairs: true,
                  }
                }}
          />
        </div>

        <div className={styles.resultsPanel}>
          {result && (
            <div
              className={`${styles.result} ${
                result.includes('Error') ? styles.error : ''
              }`}
            >
              {result}
            </div>
          )}
          {logs.length > 0 && (
            <div className={styles.logs}>
              {logs.map((log, index) => (
                <pre key={index} className={styles.logLine}>
                  {log}
                </pre>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            type='button'
            onClick={handleRunCode}
            disabled={isExecuting || readOnly}
            className={styles.button}
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
          <button
            type='submit'
            disabled={isSubmitting || readOnly}
            className={`${styles.button} bg-green-600 hover:bg-green-700`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Code'}
          </button>
        </div>
      </form>
    </div>
  );
}
