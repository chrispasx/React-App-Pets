# Pet Store React Application 🐾

A modern, responsive React application that allows users to browse and filter pets by their status using the Petstore Swagger API.

## ✨ Features

- Real-time pet filtering by status (available, pending, sold)
- Responsive design with Tailwind CSS
- Custom animated loading states
- Error handling and user feedback
- Clean and intuitive user interface
- Abortable API requests

## 🔧 Tech Stack

- React
- TailwindCSS
- Axios
- Vite

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pet-store.git
cd pet-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

## 🏗️ Project Structure

```plaintext
/src
  ├── components/
  │   └── Spinner.jsx
  ├── App.jsx
  └── main.jsx
```

## 🔌 API Integration

The application uses the Petstore Swagger API:
- Endpoint: `https://petstore.swagger.io/v2/pet/findByStatus`
- Methods: GET
- Parameters: status (available, pending, sold)

## 🎨 Styling

This project uses Tailwind CSS for styling with:
- Responsive design
- Custom animations
- Color themes for different pet statuses
- Modern gradient backgrounds

## 📄 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request