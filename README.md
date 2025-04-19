# tailwind-replace-colors

**Auto-replace `oklch(...)` colors with Tailwind-compatible `var(--color-value-number)` variables.**

---

## ✨ Features

- Zero dependencies, fast and lightweight
- Replace strict `oklch(l c h)` matches from your CSS
- Overwrites the input file directly

---

## 🚀 Usage

```bash
npx tailwind-replace-colors <input.css>
```

Example:

```bash
npx tailwind-replace-colors src/app/globals.css
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

Output after running:

```css
.dark {
  --background: var(--color-neutral-950);
  --foreground: var(--color-neutral-50);
  --card: var(--color-neutral-900);
  --card-foreground: var(--color-neutral-50);
  --popover: var(--color-neutral-900);
  --popover-foreground: var(--color-neutral-50);
  --primary: var(--color-neutral-200);
  --primary-foreground: var(--color-neutral-900);
  --secondary: var(--color-neutral-800);
  --secondary-foreground: var(--color-neutral-50);
  --muted: var(--color-neutral-800);
  --muted-foreground: var(--color-neutral-400);
  --accent: var(--color-neutral-800);
  --accent-foreground: var(--color-neutral-50);
  --destructive: var(--color-red-400);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: var(--color-neutral-500);
  --chart-1: var(--color-blue-700);
  --chart-2: var(--color-emerald-500);
  --chart-3: var(--color-amber-500);
  --chart-4: var(--color-purple-500);
  --chart-5: var(--color-rose-500);
  --sidebar: var(--color-neutral-900);
  --sidebar-foreground: var(--color-neutral-50);
  --sidebar-primary: var(--color-blue-700);
  --sidebar-primary-foreground: var(--color-neutral-50);
  --sidebar-accent: var(--color-neutral-800);
  --sidebar-accent-foreground: var(--color-neutral-50);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: var(--color-neutral-500);
}
```

---

## 📦 Install Globally (Optional)

```bash
npm install -g tailwind-replace-colors
```

Then:

```bash
tailwind-replace-colors src/app/globals.css
```

---

## 📄 License

MIT – [LICENSE](LICENSE)
