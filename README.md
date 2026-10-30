# Samuel Mifta · Portfolio

Personal portfolio website of **Samuel Mifta**, a software engineer building web apps, cross-platform mobile apps and desktop systems.

**Live:** https://sami7ma.github.io/Sami7ma/

## Featured work

| # | Project | Stack |
| :-- | :-- | :-- |
| 01 | [BanKoni](https://github.com/Sami7ma/Bankoni): local-first personal finance tracker for Android and iOS | React Native · Expo · TypeScript · SQLite · Zustand |
| 02 | [AlgoVisuals](https://github.com/Sami7ma/AlgoVisuals): interactive visualizer for data structures, algorithms and OS concepts | React · Vite · JavaScript |
| 03 | [Student Management System](https://github.com/Sami7ma/Student-Management-System-): local-first C++17 records app with a terminal UI, analytics and an audit log | C++17 · Make & CMake |
| 04 | [Pharmacy System](https://github.com/Sami7ma/Pharmacy-GUI): desktop suite for inventory, orders, customers and transactions (behind "More work") | Java · Swing · SQL Server · JDBC |

## Features

- Wide editorial desktop layout with a sticky right-hand rail, collapsing cleanly on tablet and mobile
- Name in a variable serif font: the letters swell as the pointer moves near them (a gentle idle wave on touch screens)
- An elastic ID-card lanyard that stays on the right while you scroll (a longer ribbon on desktop and tablet). Pull it as hard as you like: the satin strap with the black "SAMUEL MIFTA" lettering stretches, thins, snaps back and bounces. The card is white in light mode and Birana parchment in dark mode, with a QR code that opens a Telegram chat (`t.me/sami7ma`)
- AlgoVisuals is shown as the real, live site inside a desktop window (a scaled iframe); click it to open the full-screen portal
- Student Management System shown as a swipeable deck of screenshots plus a walkthrough video
- **More work** line (styled like the Toolbox heading): drops the Pharmacy System card down and, at the same time, adds its tools (Java, Swing, JDBC, SQL Server) and its filter to the toolbox with the same motion
- **Take my card** button: the card unclips from the lanyard, flips through the air to the button and lands as a downloaded PDF of the card (white in light mode, Birana parchment in dark mode) with clickable email, Telegram, LinkedIn and GitHub links and the QR code. A small link offers a `.vcf` contact file instead. A fresh card then drops back onto the strap
- Toolbox grouped into Languages, Frameworks, Data, Cloud & platforms and Tools. Pick a project and its tools fly up and gather right under the buttons (pick it again, or Everything, to put them back)
- Gold circuit-and-braces logo mark in the header, on the ID card badge (page and PDF) and as the favicon. Transparent and avatar versions are in `assets/logo/`
- Burgundy and brown palette, with Birana (parchment) and dark themes remembered between visits
- Slim white scroll progress bar
- Respects `prefers-reduced-motion`
- Zero dependencies: plain HTML, CSS and JavaScript

## Project structure

```
index.html   page markup, project list, deck and toolbox
styles.css   design system, themes and responsive layout
script.js    theme, elastic lanyard physics, live preview, portal, deck, More work and toolbox filter
assets/      Student Management System screenshots and walkthrough video
```

## Run locally

No build step is needed. Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

The AlgoVisuals preview needs an internet connection and the site must allow being framed (Vercel does by default; if you add an `X-Frame-Options` or `frame-ancestors` header, allow `sami7ma.github.io`).

## Deploy

Push to a GitHub repository and enable **GitHub Pages** (Settings → Pages → deploy from the `main` branch, root folder).

## Contact

- GitHub: [@Sami7ma](https://github.com/Sami7ma)
- LinkedIn: [samuel-mifta](https://www.linkedin.com/in/samuel-mifta-062aaa263/)
- Telegram: [@sami7ma](https://t.me/sami7ma)
- Email: samuelmifta@gmail.com
