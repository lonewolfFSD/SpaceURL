# 🌌 SpaceURL

SpaceURL is a fast and minimalistic URL shortener designed to turn long links into sleek, trackable short URLs. Built with modern web technologies, SpaceURL offers an intuitive and user-friendly experience.

![SpaceURL Showcase](https://i.ibb.co/Kj4wMQBY/Screenshot-2025-02-21-184402.png)

<br>

## 🌟 Features

- 🔗 **Shorten URLs Instantly** – Paste any long URL and get a short, shareable link.
- 📊 **Track Clicks & Analytics** – See how many times your link has been clicked.
- 🌍 **Country-Based Insights** – Identify visitor locations.
- 📱 **Device-Based Tracking** – Know whether your users visit from desktop or mobile.
- 🏷️ **Custom Aliases** – Create personalized short links.
- 🎨 **Modern UI** – Clean, dark-themed interface.

<br>

## 🚀 Demo
[Live Demo](https://lonewolffsd.github.io/SpaceURL/) (May not work on GitHub Pages. See the note below.)

<br>

## ⚠️ Important Note About GitHub Pages
SpaceURL relies on **dynamic URL redirection**, which does not work properly on GitHub Pages due to its static hosting limitations. If you are testing on GitHub Pages and encountering 404 errors when accessing short links, consider hosting it on a platform that supports server-side routing (e.g., Vercel, Netlify, or a custom server).

<br>

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```sh
 git clone https://github.com/lonewolfFSD/SpaceURL.git
 cd SpaceURL
```

### 2️⃣ Install dependencies
```sh
 npm install
```

### 3️⃣ Start the development server
```sh
 npm run dev
```

### 4️⃣ Build for production
```sh
 npm run build
```

### 5️⃣ Deploy
To deploy on GitHub Pages, make sure to set the correct `base` in `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/SpaceURL/', // Match your repo name
});
```
Then, deploy using:
```sh
 npm run deploy
```

<br>

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Supabase (for authentication & database)
- **Deployment:** Vercel / Netlify / GitHub Pages

<br>

## 📜 License
This project is licensed under the [MIT License](LICENSE).

<br>

## 💬 Feedback & Contributions
Feel free to fork, open issues, and submit pull requests. If you have suggestions or need help, contact me!

---

Made with ❤️ by [LonewolfFSD](https://github.com/lonewolfFSD)


