import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPlay, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const LANGUAGE_TEMPLATES = {
  python: `# Python Template
def main():
    # Your code here
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  
  cpp: `// C++ Template
#include <iostream>
using namespace std;

int main() {
    // Your code here
    cout << "Hello, World!" << endl;
    return 0;
}`,
  
  java: `// Java Template
public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`,
  
  c: `// C Template
#include <stdio.h>

int main() {
    // Your code here
    printf("Hello, World!\n");
    return 0;
}`
};

const LANGUAGE_MAPPINGS = {
  python: { extension: 'py', codexKey: 'py' },
  cpp: { extension: 'cpp', codexKey: 'cpp' },
  java: { extension: 'java', codexKey: 'java' },
  c: { extension: 'c', codexKey: 'c' }
};

const IDE = () => {
  const { darkMode } = useTheme();
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.python);
  const [language, setLanguage] = useState('python');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_TEMPLATES[newLanguage]);
    setOutput('');
    setError('');
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const response = await axios.post('/code/execute', {
        code,
        language: LANGUAGE_MAPPINGS[language].codexKey,
        input
      });

      if (response.data.error) {
        setError(response.data.error);
        toast.error('Code execution failed');
      } else {
        setOutput(response.data.output);
        if (response.data.status.id === 3) { // Status 3 means Accepted
          toast.success('Code executed successfully');
        } else {
          setError(response.data.error);
          toast.error('Code execution failed');
        }
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setError(error.response?.data?.error || 'Error executing code. Please try again.');
      toast.error('Failed to execute code');
    } finally {
      setIsLoading(false);
    }
  };

  const languageExtensions = {
    python: python(),
    cpp: cpp(),
    java: java(),
    c: cpp() // Using C++ extension for C as they share similar syntax
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`px-4 py-2 rounded ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>

              <button
                onClick={runCode}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-2 rounded ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <FaPlay />
                    Run Code
                  </>
                )}
              </button>
            </div>

            <div className={`rounded-lg overflow-hidden border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <CodeMirror
                value={code}
                height="500px"
                theme={darkMode ? 'dark' : 'light'}
                extensions={[languageExtensions[language]]}
                onChange={(value) => setCode(value)}
              />
            </div>
          </div>

          <div className="lg:w-1/3 space-y-4">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h2 className="text-xl font-bold mb-2">Input</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full h-32 p-2 rounded ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
                }`}
                placeholder="Enter input here..."
              />
            </div>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h2 className="text-xl font-bold mb-2">Output</h2>
              <pre className={`w-full h-64 p-2 rounded overflow-auto ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'
              } ${error ? 'text-red-500' : ''}`}>
                {error || output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDE; 