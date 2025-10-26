import React from 'react';
import { CodeHighlighterProps } from './types';

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ code, language = 'javascript' }) => {
  return (
    <pre className="text-text-primary whitespace-pre-wrap font-mono text-sm">
      <code>{code}</code>
    </pre>
  );
};

export default CodeHighlighter;