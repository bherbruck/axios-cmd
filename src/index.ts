#!/usr/bin/env node

import axios, { AxiosRequestConfig } from 'axios'
import { writeFile } from 'fs/promises'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv))
  .options({
    method: {
      choice: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
      default: 'GET',
      describe: 'HTTP method',
    },
    url: {
      type: 'string',
      required: true,
      describe: 'URL to send the request to',
    },
    headers: {
      type: 'string',
      default: undefined,
      describe: 'HTTP headers to send',
    },
    body: { type: 'string', default: undefined, describe: 'HTTP body to send' },
    output: {
      type: 'string',
      default: undefined,
      describe: 'File to write the response to',
    },
  })
  .parseSync()

interface RequestOptions {
  method: string
  url: string
  headers: string
  body: string
  output: string
}

async function request(requestOptions: RequestOptions) {
  const { method, url, headers, body, output } = requestOptions

  console.log(requestOptions)

  const options = {
    method,
    url,
    headers: headers !== undefined ? JSON.parse(headers) : undefined,
    data: body !== undefined ? JSON.parse(body) : undefined,
    timeout: 10000,
  } as AxiosRequestConfig

  console.log(`${method} ${url}`)

  const res = await axios(options)

  if (output !== undefined) {
    console.log(`OUT ${requestOptions.output}`)
    await writeFile(output, JSON.stringify(res.data))
  } else {
    console.log(res.data)
  }
}

request(argv)
