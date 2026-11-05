# Stellar Memories

> Some lessons end with the bell. The best ones never do.

**Stellar Memories** is an interactive web tribute created to honor and thank teachers for their endless guidance and inspiration. Instead of a plain "Happy Teachers' Day" page, it is designed as a short, cinematic, emotional experience: a journey from a classroom to a universe of gratitude, ending with a personal message for the teacher.

Built with [Lovable](https://lovable.dev).

## The Experience

The project is designed around the idea that a teacher doesn't just teach a subject. They leave a mark that stays long after the class ends. The journey follows this path:

1. **The Beginning** – a dark screen, soft ambient light and floating particles, with a button to enter the classroom.
2. **The Classroom** – a stylized classroom with a blackboard that welcomes the teacher and introduces the day's lesson: gratitude.
3. **The Teacher Reveal** – the lights dim and the teacher's name and subject appear on the board.
4. **Classroom to Galaxy** – the classroom breaks into glowing particles that become stars.
5. **The Constellation** – stars connect to form the teacher's name, surrounded by words like guidance, patience, knowledge and inspiration.
6. **What You Taught Me** – a personalized note about what the teacher taught beyond the subject.
7. **Memory Capsule** – a floating card holding a personal memory of that teacher.
8. **CSE Easter Egg** – a futuristic terminal sequence that concludes that a teacher's impact is infinite.
9. **Gratitude and the Final Message** – a calm closing scene with a heartfelt, personalized Teachers' Day message and the option to replay the journey.

## One Website, Many Wishes

A single site serves every teacher. The page reads a `to` parameter from the link and loads that teacher's details, so each person gets their own experience:

```
https://your-site.example/?to=anitha
https://your-site.example/?to=ramesh
```

Each teacher's entry holds a name, subject, personal message, memory, appreciation and quote.

## Project Structure

```
memories-/
├── .lovable/              # Lovable project settings
├── public/                # Static assets
├── src/                   # Application source code
├── .env.example           # Example environment variables
├── google-apps-script.js  # Google Apps Script file
├── components.json        # UI component configuration
├── metadata.json          # Project metadata
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # Linting rules
├── .prettierrc            # Code formatting rules
└── AGENTS.md              # Notes for AI coding agents
```

## Getting Started

You need Node.js and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```bash
git clone https://github.com/Eswar2047-code/memories-.git
cd memories-
cp .env.example .env
npm i
npm run dev
```

Fill in any values listed in `.env.example` before running the app.

## Working with Lovable

- **Ship faster:** describe what you want to build and Lovable handles the code.
- **Stay in sync:** every change made in Lovable is committed straight to this repository.
- **Full ownership:** push to `main` on GitHub and your changes sync back into Lovable.

## Contributing

Suggestions and improvements are welcome. Fork the repository, create a feature branch, and open a pull request.

## Author

**Eswar** — [github.com/Eswar2047-code](https://github.com/Eswar2047-code)
