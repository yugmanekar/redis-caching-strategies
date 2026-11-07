# Deployment Guide: CacheCraft by Kalvium

The application is completely built and ready to deploy. The optimized production build is located in the **`dist/`** folder.

Here are the **3 easiest and fastest free hosting methods** to get your public link for the Kalvium submission form:

---

## 🚀 Option 1: Drag-and-Drop on Netlify (Fastest & No CLI / Auth Setup Needed — 60 Seconds)

1. Open your browser and go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Log in (or sign up with GitHub / Google for free).
3. Open your computer's file explorer and navigate to:
   ```
   C:\Users\Admin\OneDrive\Desktop\kalvium\redis-caching-strategies
   ```
4. **Drag and drop the `dist` folder** directly onto the Netlify Drop page in your browser.
5. In 5 seconds, Netlify will generate a live public URL (e.g. `https://cachecraft-kalvium.netlify.app`).
6. Copy that URL — **that is your Deliverable 1 link!**

---

## ⚡ Option 2: Deploy to Vercel (1 Command)

You already have the Vercel CLI installed on your machine.

1. Open PowerShell or Command Prompt.
2. Run:
   ```bash
   cd C:\Users\Admin\OneDrive\Desktop\kalvium\redis-caching-strategies
   vercel login
   ```
   *(It will open a browser tab to authenticate with GitHub or your email)*.
3. Once logged in, run:
   ```bash
   vercel --prod
   ```
4. Press Enter to accept defaults. Vercel will output your live URL (e.g. `https://redis-caching-strategies-xxx.vercel.app`).

---

## 🐙 Option 3: Deploy via GitHub + Vercel / GitHub Pages

If you want the GitHub repository link and automatic deployment:

1. Create a new public repository on GitHub named:
   ```
   redis-caching-strategies
   ```
2. In your terminal, run:
   ```bash
   cd C:\Users\Admin\OneDrive\Desktop\kalvium\redis-caching-strategies
   git remote add origin https://github.com/yugmanekar/redis-caching-strategies.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), select your GitHub repository `redis-caching-strategies`, and click **Deploy**.
4. You now have both your **Public GitHub Repository Link** and **Live Hosted Website Link**!
