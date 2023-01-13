import JSONCrush from 'jsoncrush';

export const decompress_JSON = (json_string: string) => JSONCrush.uncrush(json_string);

export const compress_JSON = (json: object) => JSONCrush.crush(JSON.stringify(json));
