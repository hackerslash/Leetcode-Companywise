<div align="center">

<img src="public/favicon.svg" alt="LC Companywise logo" width="96">

# LeetCode Companywise

Practice LeetCode questions by company, time period, frequency and difficulty, and track what you've solved.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Flc-companywise.hackerslash.dev&style=flat-square)](https://lc-companywise.hackerslash.dev/)

**[lc-companywise.hackerslash.dev](https://lc-companywise.hackerslash.dev/)**

</div>

A static React dashboard over company-tagged interview question lists for 680+ companies. Pick a company and a time window, filter and sort the list, and mark questions as solved. Progress is stored in your browser.

## Features

- Question lists per company for the last 30 days, 3 months, 6 months, more than 6 months, or all time
- Search by title, filter by difficulty, sort by frequency or acceptance rate
- Company tags on each question showing where else it has been asked
- Solved tracking saved in `localStorage`, no account needed
- Profile page with charts of progress by difficulty and company (Recharts)
- Light and dark themes, following the system setting by default

## Quick start

```bash
npm install
npm run dev        # or ./start_server.sh to expose it on your LAN
npm run build      # static output in dist/
npm run preview
```

## Updating the data

```bash
./update-leetcode-db.sh
```

This pulls the latest CSVs from the upstream dataset into `public/data/` (needs `git` and `rsync`) and runs `generate_index.js` to rebuild `public/companies.json` and `public/question_companies.json`.

## Data source

Question data comes from [snehasishroy/leetcode-companywise-interview-questions](https://github.com/snehasishroy/leetcode-companywise-interview-questions). Thanks to its maintainers.
