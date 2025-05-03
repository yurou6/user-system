import React, { useState, useEffect } from 'react'
import { supabase } from './createClient'
import AddUserForm from './components/user/AddUserForm'

type GenderEnum = 'male' | 'female' | 'other'
type OccupationEnum = 'student' | 'engineer' | 'teacher' | 'doctor' | 'other'

const DEFAULT_AVATAR_URL = 'https://joihrbpnbtkrhnyijfxf.supabase.co/storage/v1/object/public/avatars//image%209.png'

interface User {
  id: string
  name: string
  gender: GenderEnum
  birthday: string
  occupation: OccupationEnum
  phone_number: string
  avatar_url: string | null
}

const App = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false) 

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('users').select('*')
      if (error) throw error
      console.log(data)
      setUsers(data as User[])
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleFormClose = (shouldRefresh: boolean) => {
    setIsFormOpen(false)
    if (shouldRefresh) {
      fetchUsers()
    }
  }
  
  if (loading) return <div>載入中...</div>
  if (error) return <div>錯誤: {error}</div>

  return (
    <div>
      <div className="flex justify-center items-center my-[80px] mx-[123px] bg-[#444647] text-white rounded-[30px] h-[195px] font-semibold text-5xl">
        <h1>使用者管理系統</h1>
      </div>
      <div className="flex my-[80px] mx-[123px]">
        <button>Card</button>
        <button>Table</button>
        <button>search</button>
        <div className="container mx-auto p-4">
          <AddUserForm onClose={handleFormClose} />
        </div>
      </div>
      <ul>
        {users.map(user => (
          <div key={user.id}>
            <img 
              src={user.avatar_url || DEFAULT_AVATAR_URL} 
              alt="頭像" 
              style={{ width: '250px', height: '250px' }} 
            />
            <div>姓名: {user.name}</div>
            <div>性別: {user.gender}</div>
            <div>生日: {user.birthday}</div>
            <div>職業: {user.occupation}</div>
            <div>電話: {user.phone_number}</div>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default App