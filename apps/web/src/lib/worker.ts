import { initializeGenerator, generate } from '@tinybirdco/mockingbird'

onmessage = async function (e) {
  if ('init' in e.data) {
    if ('config' in e.data) initializeGenerator(e.data.config)
    else console.error('No config supplied to worker')
  } else {
    await generate(data => self.postMessage(data.length))
  }
}
