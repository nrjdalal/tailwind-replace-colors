#!/usr/bin/env node
import { parseArgs } from "node:util"
import { name } from "~/package.json"

const helpMessage = `info

Usage:
  $ ${name} test <prompt> [options]

Options:
  -h, --help  Display help message`

export const test = (args: string[]) => {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: {
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
      args,
    })

    if (!args.length) throw new Error(helpMessage)

    if (!positionals.length) {
      if (values.help) {
        console.log(helpMessage)
        process.exit(0)
      }
    }

    console.log(`test says: ${args.join(" ")}`)
    process.exit(0)
  } catch (err: any) {
    console.error(helpMessage)
    console.error(`\n${err.message}\n`)
    process.exit(1)
  }
}
