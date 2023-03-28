import JSONCrush from 'jsoncrush'

export const decompressJSON = (json_string: string) =>
  JSONCrush.uncrush(json_string)

export const compressJSON = (json: object) =>
  JSONCrush.crush(JSON.stringify(json))
