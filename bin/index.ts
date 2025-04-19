#!/usr/bin/env node
import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import { author, name, version } from "~/package.json"
import { COLORS } from "./colors"

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

// --- OKLCH Utils --- //

const parseOKLCH = (str: string) => {
  const match = str.match(/oklch\(([^)]+)\)/)
  if (!match) return null
  const [l, c, h] = match[1].trim().split(/\s+/).map(Number)
  return { l, c, h }
}

const areOKLCHEqual = (
  a: { l: number; c: number; h: number },
  b: { l: number; c: number; h: number },
) => {
  return a.l === b.l && a.c === b.c && a.h === b.h
}

const loadThemeColors = async (themeColors: string) => {
  const themeCSS = themeColors
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
    .map(([key, value]) => ({ varName: key, oklch: parseOKLCH(value) }))
    .filter((x) => x.oklch)

  parsedTheme.sort((a, b) => {
    if (a.varName.includes("neutral") && !b.varName.includes("neutral"))
      return -1
    if (!a.varName.includes("neutral") && b.varName.includes("neutral"))
      return 1
    return 0
  })

  return css.replace(/oklch\([^)]+\)/g, (match) => {
    const target = parseOKLCH(match)
    if (!target) return match

    const found = parsedTheme.find(
      ({ oklch }) => oklch && areOKLCHEqual(oklch, target),
    )
    if (found) {
      return `var(${found.varName})`
    }
    return match
  })
}

// --- Main Runner --- //

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

    const themeColors = await loadThemeColors(COLORS)
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
