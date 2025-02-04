import { MockingbirdGenerator } from '@tinybirdco/mockingbird'

import { nameToGenerator } from './constants'

let generator: MockingbirdGenerator

onmessage = async function (e) {
  if ('init' in e.data) {
    if ('config' in e.data) {
      generator = new nameToGenerator[
        e.data.generator as keyof typeof nameToGenerator
      ](e.data.config)
    } else console.error('No config supplied to worker')
  } else if (generator) {
    await generator.generate(data => self.postMessage(data.length))
  }
}
