# Rendiichtiar.com 🚀

Website portfolio personal yang dibangun menggunakan Next.js 15, React 19, dan Tailwind CSS. Website ini menampilkan informasi profesional, proyek-proyek, dan pengalaman saya.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Frontend:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **UI Components:** 
  - Radix UI
  - Framer Motion
  - Lucide React Icons
- **Theme:** Next-themes untuk dark/light mode

## 🚀 Fitur Utama

- ⚡ Performa Tinggi dengan Next.js
- 🎨 Desain Responsif dengan Tailwind CSS
- 🌓 Dark/Light Mode
- 📱 Mobile-First Approach
- 🔒 Autentikasi Aman
- 🎭 Animasi Halus dengan Framer Motion

## 📦 Instalasi

1. Clone repository
```bash
git clone https://github.com/rendichpras/rendiichtiar.com.git
```

2. Install dependencies
```bash
npm install
# atau
yarn install
```

3. Setup environment variables
```bash
# Buat file .env dan isi dengan variabel yang diperlukan
cp .env.example .env
```

4. Jalankan database migrations
```bash
npx prisma generate
npx prisma db push
```

5. Jalankan development server
```bash
npm run dev
# atau
yarn dev
```

## 🔧 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build proyek untuk production
- `npm start` - Menjalankan production server
- `npm run lint` - Menjalankan linter

## 📝 Environment Variables

Buat file `.env` di root proyek dan tambahkan variabel berikut:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

```
MIT License

Copyright (c) 2024 Rendi Ichtiar Pratama

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 👨‍💻 Author

- [@rendichpras](https://github.com/rendichpras)
- Website: [rendiichtiar.com](https://rendiichtiar.com)