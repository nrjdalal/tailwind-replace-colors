#!/usr/bin/env node
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { author, name, version } from "~/package.json"

// --- Setup Theme Path ---

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const THEME_FILE = path.resolve(__dirname, "../../dist/bin/theme.css")

// --- CLI Help Message ---

const helpMessage = `Version:
  ${name}@${version}

Usage:
  $ ${name} <input.css>

Options:
  -v, --version    Display version
  -h, --help       Display help for <command>

Author:
  ${author.name} <${author.email}> (${author.url})`

const parse: typeof parseArgs = (config) => {
  try {
    return parseArgs(config)
  } catch (err: any) {
    throw new Error(`Error parsing arguments: ${err.message}`)
  }
}

// --- OKLCH Utilities ---

const parseOKLCH = (str: string) => {
  const match = str.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/)
  if (!match) return null
  let [, l, c, h] = match
  let lightness = l.endsWith("%") ? parseFloat(l) / 100 : parseFloat(l)
  lightness = parseFloat(lightness.toFixed(3))
  if (lightness % 1 === 0) lightness = Math.floor(lightness)
  return { l: lightness, c: parseFloat(c), h: parseFloat(h) }
}

const areOKLCHEqual = (
  a: { l: number; c: number; h: number },
  b: { l: number; c: number; h: number },
) => {
  return a.l === b.l && a.c === b.c && a.h === b.h
}

const loadThemeColors = async (themePath: string) => {
  let themeCSS = await readFile(themePath, "utf8")
  themeCSS = `
--color-white: oklch(100% 0 0);
--color-black: oklch(0% 0 0);
${themeCSS}
`
  const colors: Record<string, string> = {}
  const varRegex = /(--[\w-]+):\s*(oklch\([^)]+\))/g
  let match
  while ((match = varRegex.exec(themeCSS)) !== null) {
    const [, varName, oklchValue] = match
    colors[varName] = oklchValue
  }
  return Object.fromEntries(
    Object.entries(colors).sort(
      ([keyA, valueA], [keyB, valueB]) =>
        keyA.localeCompare(keyB) || valueA.localeCompare(valueB),
    ),
  )
}

// --- Main Replace Function ---

const replaceOKLCHWithComments = (
  css: string,
  themeColors: Record<string, string>,
) => {
  const parsedTheme = Object.entries(themeColors)
    .map(([key, value]) => {
      const parsed = parseOKLCH(value)
      return parsed ? { varName: key, oklch: parsed } : null
    })
    .filter(
      (
        x,
      ): x is { varName: string; oklch: { l: number; c: number; h: number } } =>
        x !== null,
    )

  const OKLCH_REGEX = /oklch\(([\d.]+%|[\d.]+) [\d.]+ [\d.]+\)/g
  const VAR_REGEX = /var\(--color-[a-z0-9-]+\)/g

  let result = ""
  let lastIndex = 0

  const matches = [
    ...css.matchAll(
      new RegExp(`${OKLCH_REGEX.source}|${VAR_REGEX.source}`, "g"),
    ),
  ]

  for (const match of matches) {
    const token = match[0]
    const matchIndex = match.index ?? 0

    result += css.slice(lastIndex, matchIndex)

    let replacement = token

    if (token.startsWith("oklch(")) {
      const target = parseOKLCH(token)
      if (target) {
        const found = parsedTheme.find(({ oklch }) =>
          areOKLCHEqual(oklch, target),
        )
        if (found) {
          let commentVar = found.varName
          replacement = `${token}; /* ${commentVar} */`
        } else {
          const closest = parsedTheme.reduce((prev, curr) => {
            const deltaE = (
              a: { l: number; c: number; h: number },
              b: { l: number; c: number; h: number },
            ) => {
              const deltaL = a.l - b.l
              const deltaC = a.c - b.c
              const deltaH = a.h - b.h
              return Math.sqrt(
                deltaL * deltaL + deltaC * deltaC + deltaH * deltaH,
              )
            }
            return deltaE(curr.oklch, target) < deltaE(prev.oklch, target)
              ? curr
              : prev
          })
          replacement = `${token}; /* close to ${closest.varName} */`
        }
      }
    } else if (token.startsWith("var(")) {
      const varName = token.match(/var\((--color-[a-zA-Z0-9-]+)\)/)?.[1]
      if (varName) {
        const oklchValue = themeColors[varName]
        const parsed = oklchValue ? parseOKLCH(oklchValue) : null
        if (parsed) {
          replacement = `oklch(${parsed.l} ${parsed.c} ${parsed.h}); /* ${varName} */`
        }
      }
    }

    result += replacement

    // Skip everything until next \n
    const rest = css.slice(matchIndex + token.length)
    const nextNewline = rest.indexOf("\n")
    if (nextNewline !== -1) {
      lastIndex = matchIndex + token.length + nextNewline + 1
      result += "\n"
    } else {
      lastIndex = css.length
    }
  }

  result += css.slice(lastIndex)

  return result
}

// --- Main CLI runner ---

const main = async () => {
  try {
    const { positionals, values } = parse({
      allowPositionals: true,
      options: {
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
    })

    if (values.version) {
      console.log(`${name}@${version}`)
      process.exit(0)
    }
    if (values.help) {
      console.log(helpMessage)
      process.exit(0)
    }

    let inputFile = positionals[0]

    const fallbackFiles = [
      inputFile && path.resolve(process.cwd(), inputFile),
      path.resolve(process.cwd(), "src/app/globals.css"),
      path.resolve(process.cwd(), "app/globals.css"),
      path.resolve(process.cwd(), "globals.css"),
    ]

    const foundFallback = fallbackFiles.find((file) => existsSync(file))

    if (foundFallback) {
      console.log(
        `✅ Using file: ${path.relative(process.cwd(), foundFallback)}`,
      )
      inputFile = foundFallback
    } else {
      console.error(`❌ No valid input file found.`)
      process.exit(1)
    }

    if (!existsSync(THEME_FILE)) {
      console.error(`❌ Theme file not found: ${THEME_FILE}`)
      process.exit(1)
    }

    const themeColors = await loadThemeColors(THEME_FILE)
    const inputCSS = await readFile(inputFile, "utf8")
    let outputCSS = replaceOKLCHWithComments(inputCSS, themeColors)

    const zincCount = (outputCSS.match(/\b(zinc)\b/g) || []).length
    const neutralCount = (outputCSS.match(/\b(neutral)\b/g) || []).length

    const targetComment =
      neutralCount > zincCount ? "--color-neutral-50" : "--color-zinc-50"
    outputCSS = outputCSS.replaceAll(
      /\/\* --color-(zinc|neutral)-50 \*\//g,
      `/* ${targetComment} */`,
    )

    await writeFile(inputFile, outputCSS)
    console.log(
      `✅ Updated ${path.relative(process.cwd(), inputFile)} successfully.`,
    )
  } catch (err: any) {
    console.error(helpMessage)
    console.error(`\n${err.message}\n`)
    process.exit(1)
  }
}

main()
