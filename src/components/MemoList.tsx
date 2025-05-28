import React from 'react';
import type { Memo } from '../types';

interface MemoListProps {
  memos: Memo[];
  onSelectMemo: (memo: Memo) => void;
  onDeleteMemo: (memoId: string) => void;
  currentMemoId: string | null;
}

const MemoList: React.FC<MemoListProps> = ({ memos, onSelectMemo, onDeleteMemo, currentMemoId }) => {
  if (memos.length === 0) {
    return <div className="memo-list empty">No memos yet.</div>;
  }

  // 更新順にソート（新しいものが上）
  const sortedMemos = [...memos].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="memo-list">
      <h2>Memo List</h2>
      <ul>
        {sortedMemos.map((memo) => (
          <li 
            key={memo.id} 
            className={`memo-list-item ${memo.id === currentMemoId ? 'active' : ''}`}
          >
            <div className="memo-item-content" onClick={() => onSelectMemo(memo)}>
              <span className="memo-item-text">
                {memo.content.substring(0, 50) || 'Untitled Memo'}
                {memo.content.length > 50 ? '...' : ''}
              </span>
              <span className="memo-item-date">
                {new Date(memo.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <button 
              onClick={() => onDeleteMemo(memo.id)} 
              className="delete-memo-button"
              aria-label={`Delete memo: ${memo.content.substring(0,20)}`}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
