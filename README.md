
# Identity Lab Monorepo

This is the high-performance foundation for the **AI Identity Platform**. It uses a monorepo structure to keep the application and the scientific documentation unified but independent.

## Project Structure

- **`/app`**: The core Next.js 16 application (IQ Analysis, Psychology Lab). Runs on `http://localhost:3000`.
- **`/docs`**: Scientific whitepapers and user guides powered by Fumadocs. Runs on `http://localhost:3001`.
- **`/node_modules`**: Shared, de-duplicated dependencies managed at the root level by `pnpm`.

## Getting Started

Ensure you have [pnpm](https://pnpm.io/installation) installed.

1. **Install Dependencies** (Run from root):
   ```
   pnpm install
	```

2.  **Launch Development Environment**:
	   ```
    pnpm dev
    ```
    _This will start both the App and the Docs simultaneously._
    

## 🛠 Available Scripts

All scripts are executed from the root using `pnpm` workspaces:

**Command Description**

`pnpm dev`

Starts both apps with Turbopack enabled.

`pnpm build`

Builds both projects for production.

`pnpm lint`

Runs the linter across the entire codebase.

## Tech Stack Highlights

-   **Framework:** Next.js 16 (App Router)
    
-   **Engine:** React 19 + React Compiler (Automatic Memoization)
    
-   **Styling:** Tailwind CSS 4.0
    
-   **Documentation:** Fumadocs (MDX powered)
    
-   **Package Management:** pnpm Workspaces
    

## Workflow Rules

-   **Adding Packages:** Do not run `npm install`. Use `pnpm add <package>` inside the specific folder, or `pnpm add <package> --filter app` from the root.
    
-   **Env Variables:** Never commit `.env` files. Use `.env.example` as a template for keys like `GEMINI_API_KEY`.