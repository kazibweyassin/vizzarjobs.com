# VizzarJobs.com

**VizzarJobs.com** is a modern, full-stack web application designed to help users discover new job opportunities efficiently. Built with the **T3 Stack** (Next.js, TypeScript, Prisma, tRPC, TailwindCSS, and more), it demonstrates scalable architecture, best-practice full-stack engineering, and production-level DevOps.

---

## 🚀 Project Purpose & Features

VizzarJobs.com provides a user-friendly platform for:
- **Job seekers** to browse, search, and filter positions.
- **Employers/Recruiters** to post and manage job listings (extend as needed).
- **Authentication** for user accounts and secure job applications.
- **Modern UI** leveraging responsive design and accessibility.

> _Replace this section with the actual product summary, key features, and unique value your app provides._

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Backend:** [tRPC](https://trpc.io) • [Prisma ORM](https://prisma.io)
- **Database:** PostgreSQL (or your DB of choice)
- **UI:** [Tailwind CSS](https://tailwindcss.com/) • React Components
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (if used)
- **Dev Tools:** TypeScript, ESLint, Prettier, Docker support (optional)
- **Testing:** (add your testing approach if you have any)

---

## 📂 Project Structure

```text
src/
  app/            # Entry point & route definitions (Next.js)
  components/     # Reusable React UI components
  hooks/          # Custom React hooks
  lib/            # Utilities and helper functions
  server/         # Backend API logic (tRPC procedures, API handlers)
  styles/         # Tailwind or global CSS
  trpc/           # tRPC router and API code
  types/          # TypeScript type definitions
prisma/           # Prisma schema & migrations
public/           # Static assets (images, favicon, etc)
docs/             # Documentation & setup guides
```

---

## 🏁 Getting Started

### 1. **Clone & Install**

```bash
git clone https://github.com/kazibweyassin/vizzarjobs.com.git
cd vizzarjobs.com
npm install
```

### 2. **Environment Setup**

- Copy the example env file to set secrets, DB credentials, etc.  
  ```bash
  cp .env.example .env
  ```
- Edit `.env` as needed.

### 3. **Prisma Database Setup**

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. **Run the App Locally**

```bash
npm run dev
```
App will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Notable Skills Demonstrated

- Full-stack TypeScript development
- RESTless API development & typesafe communication (tRPC)
- Relational databases & ORM (Prisma)
- Modern authentication (optional: NextAuth)
- Responsive design with Tailwind
- Modular, scalable folder structure
- Automated testing/checklists (add more if you have real test coverage)
- CI/CD & DevOps (describe your deployment pipeline if relevant)

---

## 📖 Setup & Admin Guides

- [ADMIN-SETUP.md](./ADMIN-SETUP.md)
- [CRON-SETUP.md](./CRON-SETUP.md)
- [GROWTH-ANALYSIS.md](./GROWTH-ANALYSIS.md)
- [SIGNUP_IMPROVEMENTS.md](./SIGNUP_IMPROVEMENTS.md)
- [TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md)

---

## 📄 License

_MIT or add your license here._

---

## 🤝 Contributing

Contributions are welcome! See [docs/](./docs) for setup tips.

---

## 👤 Author

[Yassin Kazibwe](https://github.com/kazibweyassin)

---

## 🔗 Links & Credits

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io)
- [Prisma](https://prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
