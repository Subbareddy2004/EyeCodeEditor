import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language, theme }) => {
  return (
    <Editor
      height="400px"
      language={language}
      theme={theme}
      value={value}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 17,
        lineNumbers: 'on',
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
