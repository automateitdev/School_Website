# School Website

A modern, responsive, and dynamic web application for educational institutions, built with **Vue 3**, **Vite**, and **Pinia**. This platform integrates seamlessly with backend APIs (e.g., AcademyIMS) to provide real-time information, including notice boards, academic details, media galleries, dynamically loaded configurations, and robust user dashboards.

---

## 🌟 Key Features

- **Dynamic Data fetching:** Uses built-in mechanisms to dynamically fetch the school's basic data, logos, fonts, and notices from API endpoints.
- **Dynamic Routing:** Built-in dynamic menus and sub-menus that automatically adjust depending on customized requirements and permissions.
- **Home Dashboard & Widgets:** Includes interactive UI sections like an Image Slider, Notice Board, Media galleries, and Widgets (such as a Weather widget).
- **Galleries:** Distinct sections for Photo and Video libraries.
- **Role-Based Portals:** Links seamlessly to external Student and Academic portals.
- **Modern UI & Aesthetics:** Multiple premium fonts configured including `DM Sans`, `DM Serif Display`, `Playfair Display`, `Inter`, `Hind Siliguri`, and `Poppins`.
- **State Management:** Preserves user configurations and important API data through `Pinia` & `pinia-plugin-persistedstate`.

## 🚀 Tech Stack

- **Framework:** [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Pinia](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate`
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://github.com/axios/axios)
- **PDF Viewer:** `pdfjs-dist`
- **Icons:** FontAwesome Free

## 📂 Project Structure

```bash
📦 src
 ┣ 📂 assets       # Static files (images, icons, global styles)
 ┣ 📂 components   # Reusable UI components (Header, Footer, Slider, NoticeBoard, etc.)
 ┃ ┗ 📂 widgets    # Side widgets (e.g., Weather widget)
 ┣ 📂 composables  # Vue 3 composables for reusable specific logic (e.g., useImageUrl)
 ┣ 📂 plugins      # External plugin configurations
 ┣ 📂 router       # Vue Router configuration and programmatic routes
 ┣ 📂 stores       # Pinia stores (Primary data logic in websiteStore.js)
 ┣ 📂 views        # Component pages (e.g., Home, Contact, AboutDetails, PhotoGallery)
 ┣ 📜 App.vue      # The root Vue component
 ┣ 📜 main.js      # App entry point, attaching Pinia and Vue Router
```

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need Node.js and npm (or `yarn` / `pnpm`) installed on your machine.
- Node.js >= 20.19.0 or >= 22.12.0

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd School_Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:5173/` by default.

## 📄 Scripts

Inside the `package.json`, you will find standard `npm` commands:
- `npm run dev`: Starts the Vite development server with Hot-Module-Replacement.
- `npm run build`: Bundles the application for production setup.
- `npm run preview`: Previews the generated production build locally.

## ⚙️ Configuration & Theming

- **API Base URLs:** The website utilizes endpoints (such as `https://web.academyims.com/api/indexdata`) to load school details directly within `index.html` at load time before instantiating the Vue app for faster SEO mapping and configuration styling.
- **Component Specific Data Handling:** Pages such as Contact, Notice, and specific custom pages map data asynchronously fetched through `websiteStore.js` and component setups via `useWebsiteStore()`.
- **Environment Properties:** Uses typical Vite `.env` management mechanisms if overriding variables locally.
