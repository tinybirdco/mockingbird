import {
  TinybirdGenerator,
  UpstashKafkaGenerator,
} from '@tinybirdco/mockingbird'

let generator: TinybirdGenerator | UpstashKafkaGenerator

onmessage = async function (e) {
  if ('init' in e.data) {
    if ('config' in e.data) {
      if (e.data.generator === 'Tinybird') {
        generator = new TinybirdGenerator(e.data.config)
      } else if (e.data.generator === 'UpstashKafka') {
        generator = new UpstashKafkaGenerator(e.data.config)
      }
    } else console.error('No config supplied to worker')
  } else if (generator) {
    await generator.generate(data => self.postMessage(data.length))
  }
}
