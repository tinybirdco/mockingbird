import { TinybirdGenerator } from '@tinybirdco/mockingbird'

let tbGenerator: TinybirdGenerator

onmessage = async function (e) {
  if ('init' in e.data) {
    if ('config' in e.data) tbGenerator = new TinybirdGenerator(e.data.config)
    else console.error('No config supplied to worker')
  } else if (tbGenerator) {
    await tbGenerator.generate(data => self.postMessage(data.length))
  }
}
