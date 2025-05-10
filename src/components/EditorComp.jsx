

import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Loader from './Loader';

const EditorComp = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleLanguageChange(event) {
    setLanguage(event.target.value);
  }

  function getFileExtension(lang) {
    switch (lang) {
      case 'javascript': return 'js';
      case 'python': return 'py';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'txt';
    }
  }

  async function runCode() {
    const code = editorRef.current.getValue();
    setLoading(true);
    const data = {
      language: language === 'cpp' ? 'cpp' : language,
      version: '*',
      files: [
        {
          name: `main.${getFileExtension(language)}`,
          content: code
        }
      ],
      stdin: input
    };

    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const runOutput = response.data.run;
      const result = runOutput.stdout || runOutput.stderr || 'No output';
      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput('Error running code');
    }finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw' }}>
      {/* Editor Section */}
      <div style={{ flex: 1, borderRadius: '15px', overflow: 'hidden', border: '1px solid #ccc', margin: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px' }}>
          <select className={"btn"} onChange={handleLanguageChange} value={language}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button onClick={runCode} style={{ marginLeft: '10px' }}>
            Run Code
          </button>
        </div>
        <Editor
          height="70vh"
          language={language}
          theme="vs-dark"
          defaultValue="// Write your code here"
          onMount={handleEditorDidMount}
        />
        <div style={{ margin: '10px' }}>
          <label style={{ color: '#fff' }}>Input (stdin):</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              backgroundColor: '#1e1e1e',
              color: '#fff',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            placeholder="Enter input here..."
          />
        </div>
      </div>

      {/* Output Section */}
      <div style={{
        width: "50%",
        flex: 1,
        borderRadius: '15px',
        overflow: 'hidden',
        border: '1px solid #ccc',
        margin: '10px',
        backgroundColor: '#1e1e1e',
        color: '#ffffff',
        padding: '10px'
      }}>
        <h3>Output:</h3>
        {loading ? <Loader/> : <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>}
      </div>
    </div>
  );
};

export default EditorComp;

