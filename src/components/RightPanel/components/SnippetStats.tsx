import React from 'react';
import { Snippet } from '../../../types';

interface SnippetStatsProps {
  snippet: Snippet;
}

const SnippetStats: React.FC<SnippetStatsProps> = ({ snippet }) => {
  const getCodeStats = (code: string) => {
    const lines = code.split('\n').length;
    const characters = code.length;
    const words = code.split(/\s+/).filter(word => word.length > 0).length;
    return { lines, characters, words };
  };

  const stats = getCodeStats(snippet.code);

  return (
    <div className="bg-bg-panel border border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Statistics</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-text-secondary">Lines:</span>
          <span className="text-text-primary ml-2 font-mono">{stats.lines}</span>
        </div>
        <div>
          <span className="text-text-secondary">Characters:</span>
          <span className="text-text-primary ml-2 font-mono">{stats.characters}</span>
        </div>
        <div>
          <span className="text-text-secondary">Words:</span>
          <span className="text-text-primary ml-2 font-mono">{stats.words}</span>
        </div>
        <div>
          <span className="text-text-secondary">Language:</span>
          <span className="text-text-primary ml-2">{snippet.language}</span>
        </div>
        <div>
          <span className="text-text-secondary">Category:</span>
          <span className="text-text-primary ml-2">{snippet.category}</span>
        </div>
        <div>
          <span className="text-text-secondary">Date:</span>
          <span className="text-text-primary ml-2">{snippet.date}</span>
        </div>
      </div>
    </div>
  );
};

export default SnippetStats;
