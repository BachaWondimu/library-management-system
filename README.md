# Library Management System  

The **Library Management System** is a web-based application developed using the MEAN stack (MongoDB, Express.js, Angular, Node.js). It simplifies library operations by providing tools to manage books, users, and borrowing transactions efficiently.  

## Features  
- **Book Management**: Add, update, and delete book records.  
- **User Management**: Maintain user profiles and view borrowing histories.  
- **Transaction Tracking**: Track borrow and return statuses of books.  
- **Search Functionality**: Quickly search for books by title, author, or category.  
- **Responsive Design**: User-friendly interface built with Angular for a seamless experience.  

## Tech Stack  
- **MongoDB**: Database to store and manage book and user data.  
- **Express.js**: Backend framework to handle API requests and business logic.  
- **Angular**: Frontend framework for a dynamic and responsive user interface.  
- **Node.js**: Runtime environment for executing server-side JavaScript.  

## Installation  

### Prerequisites  
- Node.js installed on your machine  
- MongoDB installed and running locally or on a cloud service  
- Angular CLI installed globally (`npm install -g @angular/cli`)  

### Steps  
1. Clone this repository:  
   ```bash  
   git clone <repository-url>  
   cd library-management-system  
   ```  

2. Install backend dependencies:  
   ```bash  
   cd backend  
   npm install  
   ```  

3. Install frontend dependencies:  
   ```bash  
   cd ../frontend  
   npm install  
   ```  

4. Set up environment variables for MongoDB (in `/backend/.env`):  
   ```  
   MONGO_URI=<your-mongodb-connection-string>  
   PORT=5000  
   ```  

5. Start the backend server:  
   ```bash  
   cd backend  
   npm start  
   ```  

6. Start the frontend application:  
   ```bash  
   cd ../frontend  
   ng serve  
   ```  

7. Open the application in your browser:  
   - Navigate to `http://localhost:4200`.  

## API Endpoints  
- **GET /api/books**: Retrieve all books.  
- **POST /api/books**: Add a new book.  
- **PUT /api/books/:id**: Update book details.  
- **DELETE /api/books/:id**: Delete a book.  
- **GET /api/users**: Retrieve all users.  
- **POST /api/transactions**: Record a borrow/return transaction.  

## License  
This project is licensed under the [MIT License](LICENSE).  
