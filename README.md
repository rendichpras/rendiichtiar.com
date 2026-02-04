# rendiichtiar.com

This repository contains the source code for my personal website, [rendiichtiar.com](https://rendiichtiar.com).

I built this website as a playground to experiment with modern web technologies, while serving as an interactive portfolio.

## Features

- **Realtime Guestbook**: Visitors can leave messages, reply to comments, and like entries in real-time.
- **Playground**: A simple code editor integrated directly into the browser.
- **Bilingual**: Supports both Indonesian and English.
- **Modern UI**: Features Dark Mode support and smooth animations.

## Tech Stack

This project is built using:

- **Next.js 16** (App Router & Turbopack)
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma** & **PostgreSQL**
- **Clerk** (Authentication)
- **Pusher** (Real-time features)
- **Framer Motion**

## Running Locally

If you want to run this project on your local machine:

1.  **Clone & Install**

    ```bash
    git clone https://github.com/rendichpras/rendiichtiar.com.git
    cd rendiichtiar.com
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env` and fill in the required variables (Database URL, Clerk Keys, Pusher Keys, etc.).

3.  **Database Setup**

    ```bash
    npm run db:generate
    npm run db:migrate
    ```

4.  **Run Dev Server**
    ```bash
    npm run dev
    ```

## License

[MIT](LICENSE)
