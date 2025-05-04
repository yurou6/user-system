# 🧑‍💼 使用者管理系統（React + Supabase）

這是一個以 React 製作的使用者管理系統，支援圖片上傳、分頁瀏覽、職業分類、搜尋（含 debounce）、表格/卡片切換、編輯刪除功能等，並使用 Supabase 作為後端儲存資料。

---

## ✨ 功能特色

- ✅ 使用者資訊顯示（姓名、性別、生日、職業、電話、頭像）
- ✅ 支援圖片上傳與預設大頭貼顯示
- ✅ 卡片 / 表格視圖切換（含分頁，每頁 6 筆）
- ✅ 可新增、編輯、刪除使用者
- ✅ 可根據關鍵字搜尋使用者（實作 debounce）
- ✅ 資料透過 Supabase 儲存，重新整理或換電腦登入後仍能保留

---

## 🗃️ 技術架構

- 前端框架：React (Create React App)
- UI Library：可使用 Tailwind
- 後端資料庫：Supabase（PostgreSQL + RESTful API）
- 圖像儲存：Supabase Storage
- 資料持久化：從 Supabase 即時拉取，瀏覽器無需本地儲存

---

## 🧪 畫面預覽

> 🔽 專案截圖
![畫面預覽](https://github.com/user-attachments/assets/ecbd32c6-84e0-43ec-bd18-47145e8a9587)

---

## 🚀 快速開始

### 1️⃣ 安裝依賴

```bash
npm install
```

### 2️⃣ 設定環境變數 .env

請將 Supabase 專案金鑰與 URL 填入以下檔案：

```bash
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ 啟動專案

```bash
npm start
```
打開瀏覽器造訪 http://localhost:3000

---

## 🧹 資料儲存說明
所有使用者資料都儲存在 Supabase：

使用 Supabase Database 儲存使用者資料欄位（如姓名、性別等）

使用 Supabase Storage 儲存上傳圖像

每次載入頁面時從 Supabase 讀取資料

支援增、修、刪操作皆透過 Supabase API 完成

## 🔍 測試項目
👉 測試功能清單詳見：https://legend-spring-e2f.notion.site/1e958367bfbb80deaaebf480eadb7015?pvs=4
