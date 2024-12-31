'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor'
import styles from './code-editor.module.css';
import { loader } from '@monaco-editor/react';
import { CodeEditorProps, SupportedLanguage } from '@/app/types/editor';
import { CODE_SNIPPETS } from '@/app/constants/editor';
import { LanguageSelector } from './language-selector';
import ts from 'typescript';



const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Define Monokai theme
const claudeTheme: editor.IStandaloneThemeData = {
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
  height = '40vh',
  readOnly = false,
  onCodeSubmit,
  defaultLanguage = 'typescript',
  defaultValue = CODE_SNIPPETS.typescript,
}: CodeEditorProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [value, setValue] = useState<string>(defaultValue);


  useEffect(() => {
      const savedCode = localStorage.getItem('savedCode');
      if (savedCode) {
        setCode(savedCode);
    }
  }, []);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
    console.log(value)
  };

  const beforeMount = (monaco: Monaco) => {
    loader.config({ monaco });
    monaco.editor.defineTheme('claude', claudeTheme);

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
      setLogs([]);
      const logMessages: string[] = [];
  
      const customConsole = {
        log: (...args: unknown[]) => {
          const logMessage = args
            .map((arg) =>
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            )
            .join(' ');
          logMessages.push(logMessage);
        },
      };
  
      switch (language) {
        case 'typescript':
          const transpiledCode = ts.transpileModule(codeToExecute, {
            compilerOptions: {
              module: ts.ModuleKind.CommonJS,
              target: ts.ScriptTarget.ES2018,
              jsx: ts.JsxEmit.React,
            },
          }).outputText;
          
          const executeTsFunction = new Function('console', transpiledCode);
          executeTsFunction(customConsole);
          break;
  
        case 'javascript':
          const executeJsFunction = new Function('console', codeToExecute);
          executeJsFunction(customConsole);
          break;
  
        case 'python':
          // Simple Python simulation
          const pythonLines = codeToExecute.split('\n');
          for (const line of pythonLines) {
            if (line.trim().startsWith('print(')) {
              const content = line.trim().slice(6, -1);
              customConsole.log(eval(content)); // Note: eval is used for simulation purposes only
            }
          }
          break;
  
          case 'java':
            // Simple Java simulation
            const javaLines = codeToExecute.split('\n');
            let mainMethodFound = false;
            for (const line of javaLines) {
              const trimmedLine = line.trim();
              if (trimmedLine.includes('public static void main')) {
                mainMethodFound = true;
              }
              if (mainMethodFound && trimmedLine.startsWith('System.out.println')) {
                const match = trimmedLine.match(/System\.out\.println\((.*)\);/);
                if (match) {
                  const content = match[1].trim();
                  // Remove surrounding quotes if it's a string literal
                  const output = content.startsWith('"') && content.endsWith('"') 
                    ? content.slice(1, -1) 
                    : content;
                  customConsole.log(output);
                }
              }
            }
            if (!mainMethodFound) {
              customConsole.log("Error: public static void main(String[] args) method not found.");
            }
            break;
    
            case 'csharp':
              // Simple C# simulation
              const csharpLines = codeToExecute.split('\n');
              let mainMethodFoundCSharp = false;
              for (const line of csharpLines) {
                const trimmedLine = line.trim();
                if (trimmedLine.includes('static void Main')) {
                  mainMethodFoundCSharp = true;
                }
                if (mainMethodFoundCSharp && trimmedLine.startsWith('Console.WriteLine')) {
                  const match = trimmedLine.match(/Console\.WriteLine\((.*)\);/);
                  if (match) {
                    const content = match[1].trim();
                    const output = content.startsWith('"') && content.endsWith('"') 
                      ? content.slice(1, -1) 
                      : content;
                    customConsole.log(output);
                  }
                }
              }
              if (!mainMethodFoundCSharp) {
                customConsole.log("Error: static void Main(string[] args) method not found.");
              }
              break;
      
              case 'php':
                const phpLines = codeToExecute.split('\n');
                const phpVariables: { [key: string]: string } = {};
                
                for (const line of phpLines) {
                  const trimmedLine = line.trim();
                  
                  // Handle variable assignment
                  const assignmentMatch = trimmedLine.match(/^\$(\w+)\s*=\s*(.+);/);
                  if (assignmentMatch) {
                    const [, varName, varValue] = assignmentMatch;
                    phpVariables[varName] = varValue.replace(/["';]/g, '').trim();
                    continue;
                  }
                  
                  // Handle echo and print
                  if (trimmedLine.startsWith('echo') || trimmedLine.startsWith('print')) {
                    const match = trimmedLine.match(/(echo|print)\s+(.+);/);
                    if (match) {
                      let content = match[2].trim();
                      
                      // Handle string interpolation
                      content = content.replace(/"\s*\.\s*\$(\w+)\s*\.\s*"/g, (_, varName) => phpVariables[varName] || '');
                      content = content.replace(/\$(\w+)/g, (_, varName) => phpVariables[varName] || '');
                      
                      // Remove quotes if present
                      const output = content.startsWith('"') && content.endsWith('"') 
                        ? content.slice(1, -1) 
                        : content;
                      
                      customConsole.log(output);
                    }
                  }
                }
                break;
          default:
            throw new Error(`Unsupported language: ${language}`);
        }
    
        setLogs(logMessages);
      } catch (error) {
        setResult(
          `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
        );
        console.error(error);
      } finally {
        setIsExecuting(false);
      }
    };

  return (
    <div className={styles.container}>
       <LanguageSelector language={language} onSelect={handleLanguageChange} />
      <form onSubmit={handleSubmit}>
        <div className={styles.editorWrapper}>
          <Editor
            height={height}
            language={language}
            value='// Your solution here'
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
                  cursorStyle: 'line',
                  cursorBlinking: 'smooth',
                  formatOnPaste: true,
                  roundedSelection: false,
                  formatOnType: true,
                  tabSize: 2,
                  autoIndent: 'advanced',
                  readOnly,
                  accessibilitySupport: 'auto',
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
