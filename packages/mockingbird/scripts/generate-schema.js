import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as TJS from 'ts-json-schema-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  path: path.resolve(__dirname, '../src/schema.ts'),
  tsconfig: path.resolve(__dirname, '../tsconfig.json'),
  type: '*',
  skipTypeCheck: true,
  extraTags: ['description'],
};

const outputPath = path.resolve(__dirname, '../dist/Schema.json');

const schema = TJS.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, schemaString);

console.log(`Generated schema at ${outputPath}`);
