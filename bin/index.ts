#!/usr/bin/env node
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { author, name, version } from "~/package.json"

// Theme path relative to built output
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const THEME_FILE = path.resolve(__dirname, "../../dist/bin/theme.css")

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

// --- OKLCH Utilities --- //

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
  return colors
}

const replaceOKLCHWithVars = (
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

  const OKLCH_REGEX = /oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+\s*\)/g

  return css.replace(OKLCH_REGEX, (match) => {
    const target = parseOKLCH(match)
    if (!target) return match

    const found = parsedTheme.find(({ oklch }) => areOKLCHEqual(oklch, target))
    if (found) {
      if (
        found.varName === "--color-zinc-50" &&
        areOKLCHEqual(target, parseOKLCH(themeColors["--color-neutral-50"])!)
      ) {
        found.varName = "--color-neutral-50"
      }
      return `var(${found.varName})`
    }
    return match
  })
}

// --- Main CLI Runner --- //

const main = async () => {
  try {
    const args = process.argv.slice(2)

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
    if (values.help || args.length === 0) {
      console.log(helpMessage)
      process.exit(0)
    }

    const inputFileRelative = args[0]
    const inputFile = path.resolve(process.cwd(), inputFileRelative)

    if (!existsSync(inputFile)) {
      console.error(`❌ Input file not found: ${inputFileRelative}`)
      process.exit(1)
    }

    if (!existsSync(THEME_FILE)) {
      console.error(`❌ Theme file not found: ${THEME_FILE}`)
      process.exit(1)
    }

    const themeColors = await loadThemeColors(THEME_FILE)
    const inputCSS = await readFile(inputFile, "utf8")
    const outputCSS = replaceOKLCHWithVars(inputCSS, themeColors)

    await writeFile(inputFile, outputCSS)
    console.log(`✅ Replaced OKLCH and updated ${inputFileRelative}`)
  } catch (err: any) {
    console.error(helpMessage)
    console.error(`\n${err.message}\n`)
    process.exit(1)
  }
}

main()
