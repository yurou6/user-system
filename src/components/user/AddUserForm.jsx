import { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../createClient';

/**
 * @param {Object} props
 * @param {function} [props.onClose] 
 */

const AddUserForm = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '男性',
    birthday: '',
    occupation: '學生',
    phone_number: '',
    avatar_url: ''
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null);
    setAvatarError(''); 
    setPreviewUrl(''); 
    setFormData({
      name: '',
      gender: '男性',
      birthday: '',
      occupation: '學生',
      phone_number: '',
      avatar_url: ''
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null); 
    setAvatarError(''); 
    setPreviewUrl(''); 

    if (onClose) {
        onClose(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarError('');
    
    if (!file) {
      setAvatar(null);
      setPreviewUrl('');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setAvatarError('頭像圖片大小不能超過 3MB');
      setAvatar(null);
      setPreviewUrl('');
      return;
    }
    
    // 檢查檔案類型
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setAvatarError('請上傳 JPG 或 PNG 格式的圖片');
      setAvatar(null);
      setPreviewUrl('');
      return;
    }
    
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); 
    };
    
    img.src = URL.createObjectURL(file);
    
    setAvatar(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setError("請輸入姓名");
        return;
      }
      
      if (!formData.birthday) {
        setError("請選擇生日");
        return;
      }
      
      if (!formData.phone_number.trim()) {
        setError("請輸入電話號碼");
        return;
      }

      const cleanedPhoneNumber = formData.phone_number.replace(/[\s-]/g, '');
      
      const mobileRegex = /^09\d{8}$/;
      
      if (!mobileRegex.test(cleanedPhoneNumber)) {
        setError("請輸入有效的台灣電話號碼（例如：0912345678）");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const userData = {
        ...formData
      };
      
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
            .storage
            .from('avatars')
            .upload(fileName, avatar, {
                cacheControl: '3600',
                upsert: false 
        });
        
        if (uploadError) {
        console.error('上傳錯誤:', uploadError);
        throw uploadError;
        }

        const { data: urlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        userData.avatar_url = urlData.publicUrl;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: userData.name,
          gender: userData.gender,
          birthday: userData.birthday,
          occupation: userData.occupation,
          phone_number: userData.phone_number,
          avatar_url: userData.avatar_url || null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setUsers([...users, data[0]]);
        
        setFormData({
          name: '',
          gender: '男性',
          birthday: '',
          occupation: '學生',
          phone_number: '',
          avatar_url: ''
        });
        
        setAvatar(null);
        setPreviewUrl('');
        
        closeModal();

        if (onClose) {
            onClose(true);
        }
      }
    } catch (err) {
   
      console.error("新增使用者錯誤:", err.code);
      
      if (err.code === "23505" && err.message?.includes("phone_number")) {
        setError("此電話號碼已經註冊過，請使用其他電話號碼。");
      } else {
        setError("新增使用者時發生錯誤，請稍後再試。");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("載入使用者列表錯誤:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="font-sans">
      <button 
        onClick={toggleModal}
        className="flex items-center gap-2 bg-[#444647] text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        <UserPlus size={18} />
        新增使用者
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">新增使用者</h3>
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="李小龍"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>性別
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="不願意回答">不願意回答</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>生日
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>職業
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="學生">學生</option>
                  <option value="工程師">工程師</option>
                  <option value="教師">教師</option>
                  <option value="無業">無業</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500 mr-1">*</span>電話號碼
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="例如：0912345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">請輸入有效的台灣電話號碼</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  頭像
                </label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="頭像預覽" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon className="text-gray-400" size={32} />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="avatar"
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 inline-flex items-center"
                    >
                      {Upload && <Upload size={16} className="mr-2" />}
                      上傳頭像
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      請上傳 JPG 或 PNG 格式，大小不超過 3MB，最佳尺寸為 360x360 像素
                    </p>
                    {avatarError && (
                      <p className="mt-1 text-xs text-red-500">{avatarError}</p>
                    )}
                  </div>
                </div>
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
                  disabled={loading}
                  className={`px-4 py-2 bg-[#444647] text-white font-medium rounded-md flex items-center gap-1`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      處理中...
                    </>
                  ) : '新增'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="mt-6">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">頭像</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性別</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">生日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">職業</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話號碼</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={`${user.name}的頭像`} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <ImageIcon className="text-gray-400" size={18} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.birthday}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.occupation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserForm;