import React, { useState, useEffect, useRef } from 'react';
import type { Memo } from '../types';

interface MemoEditorProps {
  activeMemo: Memo | null; // nullの場合は新規作成モード
  onSaveMemo: (memo: Memo) => void;
  onNewMemo: () => void; // 新規メモ作成ボタン用
}

const MemoEditor: React.FC<MemoEditorProps> = ({ activeMemo, onSaveMemo, onNewMemo }) => {
  const [content, setContent] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeMemo) {
      setContent(activeMemo.content);
    } else {
      setContent(''); // 新規メモの場合は空にする
    }
    // 起動時とアクティブメモ変更時にテキストエリアにフォーカス
    textareaRef.current?.focus();
  }, [activeMemo]);

  // 自動保存のロジック（入力が止まってから一定時間後に保存）
  useEffect(() => {
    const handler = setTimeout(() => {
      if (content.trim() === '' && !activeMemo) return; // 空で新規の場合は保存しない

      const now = Date.now();
      const memoToSave: Memo = activeMemo
        ? { ...activeMemo, content, updatedAt: now }
        : {
            id: `memo-${now}`, // シンプルなID生成
            content,
            createdAt: now,
            updatedAt: now,
          };
      onSaveMemo(memoToSave);
    }, 500); // 500ms後に自動保存

    return () => {
      clearTimeout(handler);
    };
  }, [content, activeMemo, onSaveMemo]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="memo-editor">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        placeholder="Write your memo here..."
        className="memo-textarea"
      />
      <button onClick={onNewMemo} className="new-memo-button">New Memo</button>
    </div>
  );
};

export default MemoEditor;
