import React, { useState } from 'react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = () => {
    console.log('Submitting code:', code);
    // Here you would typically send the code to your backend for execution
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-2 p-2 border rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-2 border rounded font-mono"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Run Code
      </button>
    </div>
  );
};

export default CodeEditor;
