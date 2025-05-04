import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../createClient';

/**
 * @param {Object} props
 * @param {Object} props.user 
 * @param {function} [props.onClose] 
 * @param {function} [props.onDelete] 
 */

const DeleteUserForm = ({ user, onClose, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const closeModal = () => {
    setIsOpen(false);
    setError(null);

    if (onClose) {
      onClose(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (confirmDelete !== user.name) {
        setError("請輸入正確的用戶名稱以確認刪除");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id); 
      
      if (error) {
        throw error;
      }
      
      setIsOpen(false);
      setError(null);

      if (onClose) {
        onClose(true);
      }
      
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      console.error("刪除使用者錯誤:", err.code, err.message);
      setError("刪除使用者時發生錯誤，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-bold">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-red-600">刪除使用者</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
        
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              您即將刪除用戶 <span className="font-semibold">{user.name}</span>。此操作不可逆，用戶的所有資料將被永久刪除。
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    警告：此操作無法撤銷。請謹慎操作！
                  </p>
                </div>
              </div>
            </div>
            
            <label htmlFor="confirm-delete" className="block text-sm font-medium text-gray-700 mb-1">
              請輸入用戶名稱 <span className="font-semibold">{user.name}</span> 以確認刪除
            </label>
            <input
              type="text"
              id="confirm-delete"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder={`請輸入 ${user.name}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || confirmDelete !== user.name}
              className={`px-4 py-2 bg-red-600 text-white font-medium rounded-md flex items-center gap-1 ${confirmDelete !== user.name ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </>
              ) : '確認刪除'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;