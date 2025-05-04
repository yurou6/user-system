import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './createClient';
import AddUserForm from './components/modal/AddUserForm';
import Pagination from './components/ui/Pagination';
import UserCardView from './components/user/UserCardView';
import UserTableView from './components/user/UserTableView';
import Fuse from 'fuse.js';

type GenderEnum = 'male' | 'female' | 'other';
type OccupationEnum = 'student' | 'engineer' | 'teacher' | 'doctor' | 'other';

export interface User {
  id: string;
  name: string;
  gender: GenderEnum;
  birthday: string;
  occupation: OccupationEnum;
  phone_number: string;
  avatar_url: string | null;
}

export const DEFAULT_AVATAR_URL = 'https://joihrbpnbtkrhnyijfxf.supabase.co/storage/v1/object/public/avatars//image%209.png';
const USERS_PER_PAGE = 6;

const UserDisplayPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayMode, setDisplayMode] = useState<'card' | 'table'>('card');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); 

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  
  const currentUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      console.log(data);
      setUsers(data as User[]);
      setAllUsers(data as User[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = (shouldRefresh: boolean) => {
    if (shouldRefresh) {
      fetchUsers();
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    searchTimerRef.current = setTimeout(() => {
      if (value.trim() === '') {
        setUsers(allUsers);
        setCurrentPage(1);
        return;
      }
      
      const options = {
        keys: ['name', 'occupation'], 
        threshold: 0.3,
        ignoreLocation: true,
      };
      
      const fuse = new Fuse(allUsers, options);
      const result = fuse.search(value);
      
      setUsers(result.map(item => item.item));
      setCurrentPage(1);
    }, 300); 
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen">載入中...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">錯誤: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-center items-center mt-[60px] mb-12 bg-[#444647] text-white rounded-[30px] h-[150px] font-semibold text-4xl">
        <h1>使用者管理系統</h1>
      </div>
      
      <div>
        <div className="relative flex mb-8">
          <div className="flex items-center">
            <div>
              <button 
                className={`w-[140px] flex justify-center items-center gap-2 py-2 px-4`}
                onClick={() => setDisplayMode('card')}
              >
                <img src="card.png" alt="Card Icon" className="w-[30px] h-[30px]" />
                <span className="text-xl font-bold">Card</span>
              </button>
              {displayMode === 'card' && <div className="h-1 bg-black w-full mt-auto"></div>}
            </div>
            <div>
              <button 
                className={`w-[140px] flex justify-center items-center gap-2 py-2 px-4`}
                onClick={() => setDisplayMode('table')}
              >
                <img src="table.png" alt="Table Icon" className="w-[30px] h-[30px]" />
                <span className="text-xl font-bold">Table</span>
              </button>
              {displayMode === 'table' && <div className="h-1 bg-black w-full mt-auto"></div>}
            </div>
          </div>
          
          <div className='flex-1 flex justify-center items-center'>
            <div className='relative w-[300px] flex items-center gap-2 mt-1 py-2 px-4 bg-[#D9D9D9] rounded-[10px]'>
              <img src="search.png" alt="Search Icon" className="w-[18px] h-[18px]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜尋使用者或職業..."
                className="w-full bg-transparent outline-none text-xl"
              />
              {searchTerm && (
                <button 
                  className="absolute right-3"
                  onClick={() => handleSearch('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="rounded-[10px]">
            <AddUserForm onClose={handleFormClose} />
          </div>
        </div>
        <div className="h-0.5 bg-black w-full -mt-8"></div>
      </div>
      
      {displayMode === 'card' ? (
        <UserCardView 
          users={currentUsers}
          onClose={handleFormClose}
        />
      ) : (
        <UserTableView 
          users={currentUsers}
          onClose={handleFormClose}
        />
      )}
      
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default UserDisplayPage;