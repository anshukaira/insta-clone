# CONFLICTS ENCOUNTERED
This document contains conflict encountered during the project. This will help us when we revisit code after long time. General format for this file is:

---
## Heading
*Encoutered by*

Description

How did you solved.

---
## DOTENV
*SlayerAnsh*

Adding `.env` file to access firebase configuration using `process.env`. Reason being `dotenv` dont work on client side.

Solved by adding babel plugin `inline-dotenv` in `babel.config.js`

---
## MATERIAL BOTTOM TAB NAVIGATION
*SlayerAnsh*

Using material bottom caused hidden overlay of stacked screens preventing onPress events in posts.
Workaround was used by using bottomNavigation instead of materialBottomNavigation