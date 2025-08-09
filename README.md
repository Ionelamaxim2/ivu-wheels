# IVU Wheels

IVU Wheels is an online car wheels shop built with Next.js 14, TypeScript, and React. The project uses a modern structure, optimized for performance, SEO, and mobile experience.

## Technologies Used

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (custom, if `tailwind.config.js` is present)
- **Node.js** (for API routes and server)
- **Context API & custom hooks** (for state management)
- **Smart preloading/prefetching for images and routes**
- **Image optimization** (custom component + Next.js)
- **Deploy on Render** (or Vercel)

## Project Structure

- `src/app/` - main pages (Next.js App Router)
- `src/components/` - reusable components (Navbar, Hero, Card, etc)
- `src/data/` - static/demo product data
- `src/lib/` - utilities, store, auth functions
- `public/` - images, video, favicon, etc

## Installation & Local Development

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build & Deploy

### Local Build

```bash
npm run build
npm start
```

### Deploy on Render

1. Push your code to GitHub.
2. Create a new service on [Render.com](https://render.com/):
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Root Directory: (leave empty if Next.js is in root)
3. Add environment variables if needed (e.g. Stripe, DB, etc).
4. Click "Create Web Service" and wait for the build to finish.

### Deploy on Vercel (optional)

- You can use [Vercel](https://vercel.com/) for fast deploy, with direct GitHub import.

## Environment Variables

If you use environment variables, create a `.env.local` file with:

```
NEXT_PUBLIC_API_URL=...
OTHER_VAR=...
```

## Note for Collaborators

- The codebase is cleaned of comments and unused files.
- For any major changes, use a separate branch.
- Please follow the existing structure and conventions.

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Render Documentation](https://render.com/docs/deploy-node-express-app)
- [Vercel Documentation](https://vercel.com/docs)

---

**For questions or contributions, open an issue or contact me!**
