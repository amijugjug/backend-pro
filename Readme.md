# Backend-Pro

## Description

Backend-Pro is a project aimed at learning and understanding the fundamentals of backend development. This project serves as the backend for a YouTube-like application, showcasing the integration and functionality of various backend technologies and libraries.

## Technologies Used

The following dependencies and technologies are utilized in this project:

- **bcrypt**: For hashing passwords
- **cloudinary**: For managing media files
- **cookie-parser**: For parsing cookies
- **cors**: For enabling Cross-Origin Resource Sharing
- **dotenv**: For loading environment variables
- **express**: For building the backend server
- **jsonwebtoken**: For handling JSON Web Tokens
- **mongoose**: For MongoDB object modeling
- **mongoose-aggregate-paginate-v2**: For adding pagination to Mongoose aggregate queries
- **multer**: For handling file uploads

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary Account](https://cloudinary.com/) (for media management)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/backend-pro.git
   cd backend-pro
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=your_port_number
   MONGODB_URI=your_mongodb_uri
   CORS_ORIGIN=your_cors_origin
   ACCESS_TOKEN_SECRET='xyz'
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET='xyz'
   REFRESH_TOKEN_EXPIRY=10d
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```


4. **Start the server**:

    ```bash
    npm start
    ````

### Development

To run the server in development mode with hot reloading, use the following command:

```bash
npm run dev
```

## Project Structure

```
.
├── src
│   ├── controllers      # Route controllers
│   ├── models           # Mongoose models
│   ├── routes           # Express routes
│   ├── middlewares      # Custom middlewares
│   ├── utils            # Utility functions
│   ├── db
│   ├── services
│   ├── constants.js
│   ├── app.js           # Routing and Middleware introduction to routes
│   └── index.js         # Main application file - DB connection, App start
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out if you have any questions or need further assistance.

Happy coding! 🚀
