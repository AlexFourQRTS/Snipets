// Утилиты для синтаксического выделения кода

export const highlightCode = (code: string, language: string = 'javascript'): string => {
  return code.split('\n').map((line, index) => {
    // Простое синтаксическое выделение
    const highlightedLine = line
      .replace(/#.*$/g, (match) => `<span class="text-gray-500">${match}</span>`)
      .replace(/\b(from|import|class|def|if|return|and|or|const|let|var|function|async|await)\b/g, (match) => `<span class="text-purple-400">${match}</span>`)
      .replace(/\b(FastAPI|BaseModel|User|app|React|useState|useEffect|Component)\b/g, (match) => `<span class="text-blue-400">${match}</span>`)
      .replace(/(".*?"|'.*?')/g, (match) => `<span class="text-green-400">${match}</span>`)
      .replace(/\b(\d+)\b/g, (match) => `<span class="text-yellow-400">${match}</span>`)
      .replace(/\b(true|false|null|undefined)\b/g, (match) => `<span class="text-orange-400">${match}</span>`)
      .replace(/(\{|\}|\[|\]|\(|\)|;|,)/g, (match) => `<span class="text-gray-400">${match}</span>`);
    
    return `<div key="${index}">${highlightedLine}</div>`;
  }).join('');
};

export const getLanguageKeywords = (language: string): string[] => {
  const keywords: Record<string, string[]> = {
    javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
    typescript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'interface', 'type', 'enum'],
    python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally'],
    java: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'if', 'else', 'for', 'while', 'return'],
    cpp: ['#include', 'using', 'namespace', 'class', 'struct', 'if', 'else', 'for', 'while', 'return', 'public', 'private', 'protected'],
    csharp: ['using', 'namespace', 'class', 'interface', 'public', 'private', 'protected', 'if', 'else', 'for', 'while', 'return'],
    php: ['<?php', 'function', 'class', 'if', 'else', 'for', 'while', 'return', 'echo', 'print', 'include', 'require'],
    ruby: ['def', 'class', 'module', 'if', 'else', 'elsif', 'for', 'while', 'return', 'end', 'begin', 'rescue', 'ensure'],
    go: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'if', 'else', 'for', 'range', 'return'],
    rust: ['fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl', 'trait', 'if', 'else', 'for', 'while', 'loop', 'return'],
    swift: ['func', 'class', 'struct', 'enum', 'protocol', 'extension', 'if', 'else', 'for', 'while', 'return', 'import'],
    kotlin: ['fun', 'class', 'interface', 'object', 'val', 'var', 'if', 'else', 'for', 'while', 'return', 'import', 'package'],
    html: ['<!DOCTYPE', '<html', '<head', '<body', '<div', '<span', '<p', '<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<a', '<img', '<ul', '<ol', '<li'],
    css: ['@media', '@keyframes', '@import', '@font-face', 'margin', 'padding', 'border', 'background', 'color', 'font', 'display', 'position'],
    sql: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER'],
    json: ['true', 'false', 'null'],
    xml: ['<?xml', '<!DOCTYPE', '<', '>', '</', '='],
    yaml: ['---', '...', ':', '-', '|', '>', '&', '*', '!', '?'],
    markdown: ['#', '##', '###', '####', '#####', '######', '**', '*', '`', '```', '---', '***', '>', '-', '+', '1.', '2.', '3.'],
    bash: ['#!/bin/bash', 'if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'function', 'return'],
    powershell: ['function', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default', 'return', 'param', 'begin', 'process', 'end'],
    dockerfile: ['FROM', 'RUN', 'CMD', 'LABEL', 'MAINTAINER', 'EXPOSE', 'ENV', 'ADD', 'COPY', 'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOPSIGNAL', 'HEALTHCHECK', 'SHELL']
  };
  
  return keywords[language.toLowerCase()] || [];
};

export const detectLanguage = (code: string): string => {
  // Простое определение языка по ключевым словам
  const patterns: Record<string, RegExp[]> = {
    javascript: [/\bfunction\b/, /\bconst\b/, /\blet\b/, /\bvar\b/, /=>/],
    typescript: [/\binterface\b/, /\btype\b/, /\benum\b/, /:\s*\w+/, /<\w+>/],
    python: [/\bdef\b/, /\bclass\b/, /\bimport\b/, /\bfrom\b/, /#.*$/],
    java: [/\bpublic\b/, /\bprivate\b/, /\bclass\b/, /\binterface\b/, /System\.out\.print/],
    cpp: [/#include/, /\busing\b/, /\bnamespace\b/, /std::/, /cout\s*<<|cin\s*>>/],
    csharp: [/\busing\b/, /\bnamespace\b/, /Console\.Write/, /Console\.Read/],
    php: [/<\?php/, /\becho\b/, /\bprint\b/, /\$_/, /->/],
    ruby: [/\bdef\b/, /\bend\b/, /\bclass\b/, /\bmodule\b/, /puts\s+/],
    go: [/\bpackage\b/, /\bimport\b/, /\bfunc\b/, /:=/, /fmt\.Print/],
    rust: [/\bfn\b/, /\blet\b/, /\bmut\b/, /->/, /println!/],
    swift: [/\bfunc\b/, /\bclass\b/, /\bstruct\b/, /->/, /print\(/],
    kotlin: [/\bfun\b/, /\bval\b/, /\bvar\b/, /println\(/, /class\s+\w+/],
    html: [/<html/, /<head/, /<body/, /<div/, /<span/],
    css: [/@media/, /@keyframes/, /margin:/, /padding:/, /background:/],
    sql: [/\bSELECT\b/, /\bFROM\b/, /\bWHERE\b/, /\bINSERT\b/, /\bUPDATE\b/],
    json: [/\{/, /\}/, /"[\w]+":/, /true|false|null/],
    xml: [/<\?xml/, /<!DOCTYPE/, /<[\w]+/, /<\/[\w]+/],
    yaml: [/^---/, /^\.\.\./, /^[\w-]+:/, /^[\s]*-/],
    markdown: [/^#/, /^\*\*/, /^\*/, /^```/, /^---/],
    bash: [/^#!\/bin\/bash/, /\$/, /if\s+\[/, /for\s+in/, /while\s+\[/],
    powershell: [/\$/, /Write-Host/, /Get-/, /Set-/, /if\s+\(/],
    dockerfile: [/^FROM/, /^RUN/, /^CMD/, /^LABEL/, /^EXPOSE/]
  };
  
  let maxMatches = 0;
  let detectedLanguage = 'javascript';
  
  for (const [lang, regexes] of Object.entries(patterns)) {
    const matches = regexes.reduce((count, regex) => {
      return count + (regex.test(code) ? 1 : 0);
    }, 0);
    
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedLanguage = lang;
    }
  }
  
  return detectedLanguage;
};
