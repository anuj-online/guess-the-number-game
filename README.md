This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Guess the Number Game

This is a multiplayer guess the number game with the following features:

### How to Play
1. **Admin Setup**: One player should enter "admin" as their name to access the admin panel
2. **Player Joining**: Other players can join by entering any name (except "admin")
3. **Game Flow**:
   - Admin prepares rounds by setting row number, column number, and the actual age
   - Admin starts the round
   - Players see the row and column numbers and guess the age
   - Scores are calculated based on how close the guess is to the actual age
   - Admin can see all player scores in real-time

### Game Rules
- Score is calculated as: 100 - |guess - actual age| (minimum 0)
- Players can only submit one guess per round
- Admin can start new rounds at any time
- Admin can reset the entire game

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.