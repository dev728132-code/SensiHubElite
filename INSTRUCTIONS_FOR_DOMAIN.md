# Instructions for Connecting Your Domain

To put your website on a custom domain (like `www.yourname.com`), follow these steps:

## Step 1: Build the Project
Since this is a React application, you cannot simply open the `index.html` file in a browser. You must **build** it first to generate the production files.

1. **In the AI Studio Editor**, click on the **Settings** menu.
2. Select **Export to ZIP** or **Link to GitHub**.
3. If you export to ZIP, extract it on your computer.
4. Open a terminal in that folder and run:
   ```bash
   npm install
   npm run build
   ```
5. This will create a `dist` folder. The contents of this `dist` folder are what you need for your website.

## Step 2: Choose a Hosting Provider (Recommended: Netlify)
Netlify is the easiest way to host this app for free.

1. Go to [Netlify.com](https://www.netlify.com/) and create a free account.
2. Drag and drop your `dist` folder into the Netlify "Sites" area.
3. Your site will be live on a random URL (like `gentle-breeze-123.netlify.app`).

## Step 3: Connect Your Domain
1. In the Netlify dashboard, go to **Domain management**.
2. Click **Add custom domain**.
3. Enter your domain name.
4. Follow the instructions to update your DNS settings at your domain registrar (like GoDaddy or Namecheap).

## Why was the screen black?
If you tried to open the `index.html` file directly from the source code without building it, the browser doesn't know how to load the JavaScript modules. This is a standard behavior for modern web development. Once you follow the build steps above and host it on a server, it will work perfectly.

---

### Need Help?
- Always ensure you have your Firebase API Keys set up in the `.env` file of your hosting provider.
- For Single Page Application (SPA) routing to work (so pages don't 404 when you refresh), we have included a `netlify.toml` file in this project.
