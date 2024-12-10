import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
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
}`,
  
  sql: `-- SQL Template
-- Create a sample table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE
);

-- Insert some data
INSERT INTO users (name, email) VALUES
    ('John Doe', 'john@example.com'),
    ('Jane Smith', 'jane@example.com');

-- Query the data
SELECT * FROM users;`,

  mysql: `-- MySQL Template
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2)
);

-- Insert sample data
INSERT INTO products (name, price) VALUES
    ('Laptop', 999.99),
    ('Mouse', 29.99);

-- Query products
SELECT * FROM products;`,

  postgresql: `-- PostgreSQL Template
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary NUMERIC(10,2)
);

-- Insert sample data
INSERT INTO employees (name, department, salary) VALUES
    ('Alice Johnson', 'Engineering', 75000),
    ('Bob Wilson', 'Marketing', 65000);

-- Query employees
SELECT * FROM employees;`
};

const LANGUAGE_MAPPINGS = {
  python: { extension: 'py', codexKey: 'py' },
  cpp: { extension: 'cpp', codexKey: 'cpp' },
  java: { extension: 'java', codexKey: 'java' },
  c: { extension: 'c', codexKey: 'c' },
  sql: { extension: 'sql', codexKey: 'sql' },
  mysql: { extension: 'sql', codexKey: 'mysql' },
  postgresql: { extension: 'sql', codexKey: 'postgresql' }
};

const JUDGE0_LANGUAGE_IDS = {
  python: 71,    // Python (3.8.1)
  cpp: 54,       // C++ (GCC 9.2.0)
  java: 62,      // Java (OpenJDK 13.0.1)
  c: 50,         // C (GCC 9.2.0)
  sql: 82,       // SQL (SQLite 3.27.2)
  mysql: 82,     // MySQL
  postgresql: 82 // PostgreSQL
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
        language,
        input
      });

      if (response.data.output) {
        setOutput(response.data.output);
        if (response.data.status.id === 3) {
          toast.success('Code executed successfully');
        }
      }
      
      if (response.data.error) {
        setError(response.data.error);
        toast.error('Code execution failed');
      }

    } catch (error) {
      console.error('Code execution error:', error);
      setError(error.response?.data?.error || 'Error executing code');
      toast.error('Failed to execute code');
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageExtension = (lang) => {
    switch (lang) {
      case 'python':
        return python();
      case 'cpp':
      case 'c':
        return cpp();
      case 'java':
        return java();
      case 'sql':
      case 'mysql':
      case 'postgresql':
        return sql();
      default:
        return python();
    }
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
                <option value="sql">SQL</option>
                <option value="mysql">MySQL</option>
                <option value="postgresql">PostgreSQL</option>
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
                extensions={[getLanguageExtension(language)]}
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