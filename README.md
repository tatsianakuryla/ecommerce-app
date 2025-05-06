# 🛒 eCommerce Application

This is a feature-rich eCommerce web application built with React and TypeScript as part of the Rolling Scopes School training program.

This platform brings the real-life shopping experience into a digital space 🏪. It serves as a fully-featured online storefront, offering users an engaging and intuitive interface. From browsing products to completing a purchase, the app provides a smooth and enjoyable journey, encouraging user interaction and building purchase confidence 🚀.

Users can explore a wide selection of products 📚👗👟, access detailed descriptions, add items to their shopping cart 🛒, and complete the checkout process 💳. Key features include account registration and login, product search, categorization, and sorting options to create a streamlined and user-friendly shopping experience.

---

## 📋 Table of Contents

1. [🚀 Demo](#-demo)
2. [🔥 Features](#-features)
3. [💻 Technologies](#-technologies)
4. [🎯 Project Goals](#-project-goals)
5. [📁 Project Structure](#-project-structure)
6. [⚙️ Installation](#️-installation)
7. [🚴‍♂️ Running the App Scripts](#️-running-the-app-scripts)
8. [📜 Code Testing & Formatting Scripts](#-code-testing--formatting-scripts)

---

## 🚀 Demo

[Click here to view the live demo](https://tatsianakuryla.github.io/ecommerce-app/)

---

## 🔥 Features

- 📝 **Authentication & Authorization**: Sign up, login
- 🛍 **Product Catalog**: Browse, search, filter, and view detailed product pages
- 🛒 **Shopping Cart**: Add/remove items, adjust quantities, and persist cart in local storage
- 🔒 **Protected Routes**: Secure user profile
- 🌐 **Responsive Design**: Optimized for mobile, tablet, and desktop
- ♿ **Accessibility**: Keyboard navigation, ARIA attributes, and contrast-checked styles
- 🔄 **State Management**: Using React Context and hooks for global state
- 🔧 **Linting & Formatting**: ESLint, Prettier, StyleLint, Husky pre-commit hooks

---

## 💻 Technologies

- React
- Zustand
- TypeScript
- CSS Modules
- Vite
- ESLint
- Prettier
- Husky
- StyleLint

---

## 🎯 Project Goals

The main goal of this project is to practice building a scalable, maintainable, and fully functional web application using modern frontend technologies and development best practices.

## 📁 Project Structure

```text
E-COMMERCE-APP/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   ├── components/
│   ├── features/
│   │   ├── categories/
│   │   ├── customers/
│   │   ├── discounts/
│   │   ├── orders/
│   │   ├── prices/
│   │   └── products/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── router/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── store/
│   ├── App.tsx
│   └── index.tsx
└── README.md
```

---

## ⚙️ Installation

```bash
git clone https://github.com/tatsianakuryla/ecommerce-app.git
cd ecommerce-app
npm install
rename .env.example to .env
add actual client_id and secret to VITE_API_USERNAME and VITE_API_PASSWORD constants in your .env file, you can find client_id and secret in API doc
npm start
```

---

## 🚴‍♂️ Running the App Scripts

**📥 Install Dependencies** – Install all project dependencies

```bash
npm install
```

**🐶 Git Hooks Setup** - Initialize Husky (automatically creates Git hooks)

```bash
npm run prepare
```

**🛠 Development** - Start the project in development mode

```bash
npm start
```

**📦 Production Build** - Build the project for production

```bash
npm run build
```

**👀 Preview** - Preview the production build locally

```bash
npm run preview
```

---

## 📜 Code Testing & Formatting Scripts

**🔍 Lint Check (ESLint)** – Run ESLint to check for code issues

```bash
npm run lint
```

**🎨 Format Code (Prettier)** – Format the code using Prettier

```bash
npm run format
```

**🧪 Style Check (StyleLint)** – Run StyleLint for styling issues

```bash
npm run stylelint
```

**🧫 Run Tests** – Execute test suite (if configured)

```bash
npm test
```
