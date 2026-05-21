import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { history, historyKeymap } from '@codemirror/commands';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // 创建编辑器状态
    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        bracketMatching(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle),
        python(),
        keymap.of([...historyKeymap, ...foldKeymap]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            fontFamily: '"Space Mono", monospace',
          },
          '.cm-content': {
            fontFamily: '"Space Mono", monospace',
          },
          '.cm-gutters': {
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            border: 'none',
          },
          '.cm-activeLineGutter': {
            backgroundColor: '#e2e8f0',
          },
          '.cm-activeLine': {
            backgroundColor: '#f8fafc',
          },
        }),
      ],
    });

    // 创建编辑器视图
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // 清理函数
    return () => {
      view.destroy();
    };
  }, [value, onChange]);

  // 更新编辑器内容
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      className="w-full h-full rounded-lg border border-gray-300 overflow-hidden shadow-sm"
    />
  );
};

export default CodeEditor;