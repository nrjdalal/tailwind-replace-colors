# colorwindcss

- Effortlessly enhance your Tailwind-compatible CSS files.
- Transform `oklch(...)` colors or `var(--color-name)` variables into a standardized `oklch(l c h); /* --color-name */` format.
- Automatically add descriptive comments for matched variables.
- Provide suggestions for unmatched values (e.g., `🔥 near --color-lime-600`).

```css
/* Before */
.dark {
  --oklch-value: oklch(0.145 0 0);
  --tailwind-variable: var(--color-neutral-50);
  --random-value: oklch(0.7 0.1 140);
}
/* After */
.dark {
  --oklch-value: oklch(0.145 0 0); /* --color-neutral-950 */
  --tailwind-variable: oklch(0.985 0 0); /* --color-neutral-50 */
  --random-value: oklch(0.7 0.1 140); /* 🔥 near --color-lime-600 */
}
```

---

## 🚀 Usage

File is at `src/app/globals.css` or `app/globals.css`, run:

```bash
npx colorwindcss@latest
```

If your file is at a different path, then run:

```bash
npx colorwindcss@latest <path-to-file>
```

---

## 📂 Example

Input (`globals.css`):

```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

After running:

```css
.dark {
  --background: oklch(0.145 0 0); /* --color-neutral-950 */
  --foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --card: oklch(0.205 0 0); /* --color-neutral-900 */
  --card-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --popover: oklch(0.205 0 0); /* --color-neutral-900 */
  --popover-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --primary: oklch(0.922 0 0); /* --color-neutral-200 */
  --primary-foreground: oklch(0.205 0 0); /* --color-neutral-900 */
  --secondary: oklch(0.269 0 0); /* --color-neutral-800 */
  --secondary-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --muted: oklch(0.269 0 0); /* --color-neutral-800 */
  --muted-foreground: oklch(0.708 0 0); /* --color-neutral-400 */
  --accent: oklch(0.269 0 0); /* --color-neutral-800 */
  --accent-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --destructive: oklch(0.704 0.191 22.216); /* --color-red-400 */
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0); /* --color-neutral-500 */
  --chart-1: oklch(0.488 0.243 264.376); /* --color-blue-700 */
  --chart-2: oklch(0.696 0.17 162.48); /* --color-emerald-500 */
  --chart-3: oklch(0.769 0.188 70.08); /* --color-amber-500 */
  --chart-4: oklch(0.627 0.265 303.9); /* --color-purple-500 */
  --chart-5: oklch(0.645 0.246 16.439); /* --color-rose-500 */
  --sidebar: oklch(0.205 0 0); /* --color-neutral-900 */
  --sidebar-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --sidebar-primary: oklch(0.488 0.243 264.376); /* --color-blue-700 */
  --sidebar-primary-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --sidebar-accent: oklch(0.269 0 0); /* --color-neutral-800 */
  --sidebar-accent-foreground: oklch(0.985 0 0); /* --color-neutral-50 */
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0); /* --color-neutral-500 */
}
```

---

## 📦 Install Globally (Optional)

```bash
npm install -g colorwindcss
```

Then:

```bash
colorwindcss <path-to-file>
```

---

## 📄 License

MIT – [LICENSE](LICENSE)
