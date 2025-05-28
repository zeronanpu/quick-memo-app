import { useState, useEffect, useCallback } from 'react';
import type { Memo } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import MemoEditor from './components/MemoEditor';
import MemoList from './components/MemoList';
import './App.css'; // あとでスタイルを追加します

function App() {
  const [memos, setMemos] = useLocalStorage<Memo[]>('quick-memos', []);
  const [activeMemoId, setActiveMemoId] = useState<string | null>(null);
  const [showList, setShowList] = useState<boolean>(false); // メモ一覧の表示状態

  // URLパラメータに基づいて初期表示を決定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'list') {
      setShowList(true);
      setActiveMemoId(null); // リスト表示時はエディタをクリア
    } else {
      // デフォルトは新規メモ入力画面（または最後に編集していたメモ）
      setShowList(false);
      // ここで最後に編集していたメモをアクティブにするロジックも追加可能
      // 今回はシンプルに新規メモ状態（activeMemoId = null）で開始
    }
  }, []);

  const activeMemo = memos.find(memo => memo.id === activeMemoId) || null;

  const handleSaveMemo = useCallback((memoToSave: Memo) => {
    setMemos(prevMemos => {
      const existingIndex = prevMemos.findIndex(m => m.id === memoToSave.id);
      if (existingIndex > -1) {
        // 既存メモの更新
        const updatedMemos = [...prevMemos];
        updatedMemos[existingIndex] = memoToSave;
        return updatedMemos;
      } else {
        // 新規メモの追加
        return [memoToSave, ...prevMemos];
      }
    });
    // 保存後、そのメモをアクティブにする
    setActiveMemoId(memoToSave.id);
    // 新規メモ作成時はエディタ画面に遷移
    if (!showList && !activeMemo) {
        // setShowList(false); // 既にfalseのはずだが念のため
    }
  }, [setMemos, showList, activeMemo]);

  const handleSelectMemo = (memo: Memo) => {
    setActiveMemoId(memo.id);
    setShowList(false); // メモを選択したらエディタ画面へ
    // URLを更新して、リロードしてもエディタ画面になるようにする（オプション）
    // window.history.pushState({}, '', '/');
  };

  const handleDeleteMemo = (memoId: string) => {
    setMemos(prevMemos => prevMemos.filter(m => m.id !== memoId));
    if (activeMemoId === memoId) {
      setActiveMemoId(null); // 削除したメモがアクティブだったらクリア
      setShowList(false); // エディタ画面に戻る（新規メモ状態）
    }
  };

  const handleNewMemo = () => {
    setActiveMemoId(null); // アクティブなメモを解除（新規作成モード）
    setShowList(false);   // エディタ画面を表示
    // URLを更新して、リロードしてもエディタ画面になるようにする（オプション）
    // window.history.pushState({}, '', '/');
  };

  const toggleListView = () => {
    setShowList(prev => {
        const newListState = !prev;
        if (newListState) {
            setActiveMemoId(null); // リスト表示時はエディタをクリア
            window.history.pushState({}, '', '/?view=list');
        } else {
            // リストからエディタに戻る際は、新規メモ状態にする
            setActiveMemoId(null);
            window.history.pushState({}, '', '/');
        }
        return newListState;
    });
  };


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Quick Memo</h1>
        <button onClick={toggleListView} className="toggle-view-button">
          {showList ? 'New Memo' : 'Memo List'}
        </button>
      </header>
      <main className="app-main">
        {showList ? (
          <MemoList
            memos={memos}
            onSelectMemo={handleSelectMemo}
            onDeleteMemo={handleDeleteMemo}
            currentMemoId={activeMemoId}
          />
        ) : (
          <MemoEditor
            activeMemo={activeMemo}
            onSaveMemo={handleSaveMemo}
            onNewMemo={handleNewMemo} // MemoEditor内のNew Memoボタン用
          />
        )}
      </main>
    </div>
  );
}

export default App;
