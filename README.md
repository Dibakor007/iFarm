# ❄️ iFarm — Cold Storage Management System  

A full-stack **Cold Storage Management System** built for efficient inventory, storage monitoring, and transport booking using modern web technologies.

---

## 🚀 Features

- ✅ User authentication (Admin / Staff)
- ✅ Cold storage inventory management  
- ✅ Stock tracking and monitoring  
- ✅ Transport booking system  
- ✅ Real-time database with MySQL (XAMPP)  
- ✅ REST API backend using Node.js & Express  
- ✅ Secure environment variables  
- ✅ Modular MVC architecture  

---

## 🏗️ Tech Stack

### Backend
- Node.js  
- Express.js  
- MySQL (XAMPP)  
- mysql2  
- dotenv  
- cors  
- morgan  

### Database
- MySQL via **XAMPP / phpMyAdmin**

---

## 📁 Project Structure

ifarm-backend/
│
├── server.js
├── .env.local
├── package.json
│
└── src/
├── config/
│ └── database.js
├── controllers/
├── models/
├── routes/
├── middleware/
└── utils/

yaml
Copy code

---

## ⚙️ Environment Variables (.env.local)

Create a `.env.local` file in backend root:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cold_storage_db
PORT=4000
API_BASE_PATH=/api/v1

yaml
Copy code

---

## ▶️ How to Run the Project

### 1️⃣ Start XAMPP
- Start **Apache**
- Start **MySQL**

### 2️⃣ Clone the repository

```bash
git clone https://github.com/your-username/ifarm.git
cd ifarm-backend
3️⃣ Install dependencies
bash
Copy code
npm install
4️⃣ Run backend
bash
Copy code
npm run dev
Server will run on:

arduino
Copy code
http://localhost:4000
Test database connection:

bash
Copy code
http://localhost:4000/health
📌 Database
Import or create your MySQL database in phpMyAdmin:

diff
Copy code
Database name: cold_storage_db
Tables:
- users
- coldstorage
- stockinventory
- bookingtransport
👨‍💻 Author
Your Name
Cold Storage Management System — Academic Project

📜 License
This project is licensed under the MIT License.

yaml
Copy code

---

# ✅ GitHub Push Commands (copy-paste)

```bash
git init
git add .
git commit -m "Initial commit - Cold Storage Management System"
git branch -M main
git remote add origin https://github.com/your-username/ifarm.git
git push -u origin main
