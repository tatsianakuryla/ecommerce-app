# 🛒 eCommerce Application

This is a feature-rich eCommerce web application built with React and TypeScript as part of the Rolling Scopes School training program.

This platform brings the real-life shopping experience into a digital space 🏪. It serves as a fully-featured online storefront, offering users an engaging and intuitive interface. From browsing products to completing a purchase, the app provides a smooth and enjoyable journey, encouraging user interaction and building purchase confidence 🚀.

Users can explore a wide choice of products 📚👗👟, access detailed descriptions, add items to their shopping cart 🛒, and complete the checkout process 💳. Key features include account registration and login, product search, categorization, and sorting options to create a streamlined and user-friendly shopping experience.

---

## 📋 Table of Contents

1. [🚀 Demo](#-demo)
2. [🔥 Features](#-features)
3. [💻 Technologies](#-technologies)
4. [🎯 Project Goals](#-project-goals)
5. [📁 Project Structure](#-project-structure)
6. [⚙️ Installation](#-installation)
7. [🚴‍♂️ Running the App Scripts](#-running-the-app-scripts)
8. [📜 Code Testing & Formatting Scripts](#-code-testing--formatting-scripts)

---

## 🚀 Demo

[Click here to view the live demo](https://astounding-truffle-8b1298.netlify.app)

---

## 🔥 Features

- 📝 **Authentication & Authorization**: Sign up, login
- 🛍 **Product Catalog**: Browse, search, and view detailed product pages
- 🛒 **Shopping Cart**: Add/remove items, adjust quantities, and persist cart in local storage
- 🔒 **Protected Routes**: Secure user profile
- 🌐 **Responsive Design**: Optimized for mobile, tablet, and desktop
- ♿ **Accessibility**: Keyboard navigation, ARIA attributes, and contrast-checked styles
- 🔄 **State Management**: Using React Context and hooks for global state
- 🔧 **Linting & Formatting**: ESLint, Prettier, StyleLint, Husky pre-commit hooks

---

## 💻 Technologies

- React
- TypeScript
- CSS
- Vite
- Vitest
- ESLint
- Prettier
- StyleLint
- Husky
- Lint-staged

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
│   |   ├── AddRemoveItemButton/
│   |   ├── Breadcrumbs/
│   |   ├── CategorySidebar/
│   |   ├── ErrorAlert/
│   |   ├── Form/
|   |   |   ├──AddressForm/
|   |   |   ├──LoginForm/
|   |   |   ├──RegistrationForm/
|   |   |   └──Form.tsx
│   |   ├── Header/
│   |   ├── ImageSlider/
│   |   ├── JustRegisteredDialog/
│   |   ├── Pagination/
│   |   ├── ProductCard/
│   |   ├── ProgressCircle/
│   |   ├── PromoBanner/
│   |   └── RedirectionLink/
│   ├── constants
│   ├── contexts
│   ├── features/
│   |   └── customers/
│   ├── fixtures/
│   ├── hooks/
│   ├── layouts/
│   │   └── RootLayout.tsx
│   ├── mocks
│   ├── pages/
│   │   ├── BasketPage
│   │   ├── AboutPage
│   │   ├── CatalogPage
│   │   ├── CategoryPage
│   │   ├── LoginPage
│   │   ├── NotFoundPage
│   │   ├── ProductPage
│   │   ├── ProfilePage
│   │   ├── RegisterPage
│   ├── router/
│   ├── styles/
│   ├── tests/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
└── README.md
```

---

## ⚙️ Installation

```bash
git clone https://github.com/tatsianakuryla/ecommerce-app.git
```

```bash
cd ecommerce-app
```

```bash
npm install
```

rename .env.example to .env

Add actual values to
VITE_CLIENT_ID, VITE_CLIENT_SECRET, VITE_API_CLIENT_NAME constants.
Values are in the [API doc](https://docs.google.com/document/d/1yTAIGZu7cwOU8YcoheYfykwRaLIkq3HAkz0m4Izi3OQ/edit?tab=t.0)

```bash
npm run dev
```

---

## 🚴‍♂️ Running the App Scripts

**📥 Install Dependencies** – Install all project dependencies

```bash
npm install
```

**🐶 Git-Hooks-Setup** - Initialize Husky (automatically creates Git hooks)

```bash
npm run prepare
```

**🛠 Development** - Start the project in development mode

```bash
npm run dev
```

**📦 Production-Build** - Build the project for production

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

**🧫 Run Tests** – Execute test suite

```bash
npm test
```

**🧫 Check test coverage** – To see test coverage

```bash
npm run coverage
```
