# Table of Contents
1. Introduction
2. Installation
3. Project Structure
4. Technologies Used
5. Authentication
6. Database Configurstion
7. Form Builder Functionality
8. Deployment
9. Troubleshoot
10. Conclusion

# Introduction
[Superforms-ZA](https://superforms-za.vercel.app/) is a dynamic and user-friendly form builder platform developed using Next.js. It allows users to create customizable forms using draggable components made possible by using DnD Kit. The application leverages Prisma as its ORM to interact with a serverless PostgreSQL database and uses Clerk for user authentication.

### Getting Started
**Prerequisites**
Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database

# Installation
1. **clone the repository:**

```bash
git clone https://github.com/TshiamoTodd/superforms-za.git
cd superforms-za
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
create a `.env` file in your root folder and add your environment variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=dashboard
DATABASE_URL=YOUR-DATABASE-URL
DIRECT_URL=YOUR-DATABASE-DIRECT-URL
```

4. **Run Database Migrations:**

```bash
npx prisma migrate deploy
```

5. **Start development server:**

```bash
npm run dev
# or
yarn dev
```

# Project Structure

```
superforms-za/
├── app/
│   ├── layout.tsx
│   ├── favicon.ico
│   ├── global.css
│   ├── page.tsx
│   ├── (auth)/
│   │    ├── sign-in/[[...sign-in]]/
│   │    ├── sign-up/[[...sign-up]]/ 
│   │    └── layout.tsx
│   └── (dashboard)/
│       ├── builder/[id]/
│       ├── forms/[id]/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── context/
│   ├── fields/
│   ├── hooks/
│   ├── providers/
│   ├── stats/
│   └── ui/
├── lib/
│   ├── idGenerator.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── schemas/
│   └── form.ts
├── actions/
│   └── form.ts
├── .env
├── next.config.js
├── package.json
└── README.md
```

# Technologies Used
- **Next.js:** React framework for server-side rendering and static site generation.
- **DnD Kit:** Drag and drop toolkit for building drag and drop interfaces.
- **Prisma:** ORM for database management and migrations.
- **PostgreSQL:** Serverless relational database.
- **Clerk:** User authentication and management
- **Sonner:** Toast Notifications

# Authentication
**Set up Clerk Authentication**
- Sign up for Clerk at Clerk.com.
- Create a Clerk application and get your Frontend API.
- Add your Clerk Frontend API to your .env.local file.

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

- Wrap your application with Clerk components in `app/layout.tsx`
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import DesignerContextProvider from '@/components/context/designer-context'
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Superforms-ZA',
  description: 'This is a form builder created in Nextjs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NextTopLoader/>
          <DesignerContextProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster/>
            </ThemeProvider>
          </DesignerContextProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

# Database Configuration
Prisma is used to interact with the PostgreSQL database. The schema is defined in `prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url  	    = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Form {
  id          Int             @id @default(autoincrement())
  userId      String
  createdAt   DateTime        @default(now())
  published   Boolean         @default(false)
  name        String
  description String          @default("")
  content     String          @default("[]")

  visits      Int             @default(0)
  submissions Int             @default(0)

  shareURL    String          @unique @default(uuid())
  formSubmissions FormSubmissions[]

  @@unique([userId, name])
}

model FormSubmissions {
  id          Int             @id @default(autoincrement())
  createdAt   DateTime        @default(now())
  formId      Int
  form        Form            @relation(fields: [formId], references: [id])
  content     String          
}
```

Run the following command to generate the Prisma client:
```bash
npx prisma generate
```

# Form Functionality
The form builder interface allows users to create and customize forms by dragging and dropping components.

**Key Components**
**FormBuilder:** Main component for building forms.
**FormField:** Represents a single form field.
**DragAndDropContext:** Manages drag and drop functionality.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
