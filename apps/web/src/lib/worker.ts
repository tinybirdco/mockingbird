import { MockingbirdGenerator } from '@tinybirdco/mockingbird/client'

import { nameToGenerator } from './constants'

let generator: MockingbirdGenerator

onmessage = async function (e) {
  try {
    if ('init' in e.data) {
      if ('config' in e.data) {
        generator = new nameToGenerator[
          e.data.generator as keyof typeof nameToGenerator
        ](e.data.config)
      } else {
        throw new Error('No config supplied to worker')
      }
    } else if (generator) {
      await generator.generate(data => {
        try {
          self.postMessage(data.length)
        } catch (error) {
          self.postMessage({ error: `Error posting message: ${error}` })
        }
      })
    }
  } catch (error) {
    self.postMessage({ error: `Worker error: ${error}` })
  }
}
