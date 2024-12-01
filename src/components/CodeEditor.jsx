import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language, theme }) => {
  // Map Judge0 language IDs to Monaco editor language IDs
  const languageMap = {
    'python': 'python',
    'cpp': 'cpp',
    'java': 'java',
    'javascript': 'javascript',
    'c': 'c',
    'csharp': 'csharp',
    'ruby': 'ruby',
    'swift': 'swift',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'kotlin': 'kotlin',
    'scala': 'scala',
    'r': 'r',
    'perl': 'perl',
    'pascal': 'pascal',
    'typescript': 'typescript',
    'sql': 'sql',
    'mysql': 'sql',
    'postgresql': 'sql'
  };

  // SQL-specific editor options
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    ...(language.includes('sql') && {
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      formatOnType: true,
      formatOnPaste: true
    })
  };

  return (
    <Editor
      height="400px"
      language={languageMap[language] || 'plaintext'}
      theme={theme}
      value={value}
      onChange={onChange}
      options={editorOptions}
    />
  );
};

export default CodeEditor;
