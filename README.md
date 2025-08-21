User Management Dashboard

This is a role-based user management system built with React (frontend) and Django REST Framework (backend).
It supports authentication with JWT tokens and provides different access levels for Admins, Managers, and Employees.

Features

Admins

Create, update, and delete users

View all users

Managers

View all employees

Cannot edit or manage Admins

Employees

Can only view their own profile

Tech Stack

Frontend: React, Context API, JWT Decode

Backend: Django, Django REST Framework, SimpleJWT

Database: SQLite (can switch to PostgreSQL/MySQL)

Installation
Backend (Django)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend (React)
cd frontend
npm install
npm start

Usage

Start both frontend and backend servers

Register/login as Admin to manage users

Managers can log in to see employee list

Employees can log in to view their own profile

Folder Structure
backend/
  ├── users/        # Django app with models, views, serializers
  ├── settings.py
frontend/
  ├── src/
      ├── components/
      ├── context/AuthContext.js
      ├── pages/Dashboard.js