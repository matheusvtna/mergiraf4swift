import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const Parser = require('tree-sitter');
const Swift = require('tree-sitter-swift');

const parser = new Parser();
parser.setLanguage(Swift);

// Resolve script directory so `inputs/` and `outputs/` are relative to this file
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const inputsDir = path.join(scriptDir, 'inputs');
const outputsDir = path.join(scriptDir, 'outputs');

const arg = process.argv[2];
if (!arg) {
    console.error('Usage: node src/swift-tree-sitter-parser.js <input-filename>');
    process.exit(1);
}

const inputPath = path.join(inputsDir, arg);
if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(2);
}

let sourceCode;
try {
    sourceCode = fs.readFileSync(inputPath, 'utf8');
} catch (err) {
    console.error(`Failed to read input file: ${err.message}`);
    process.exit(3);
}

const tree = parser.parse(sourceCode);

function printNodeLines(node, indent = 0) {
    const lines = [];
    lines.push(`${' '.repeat(indent)}${node.type} [${node.startPosition.row}:${node.startPosition.column} - ${node.endPosition.row}:${node.endPosition.column}]`);
    for (const child of node.children) {
        lines.push(...printNodeLines(child, indent + 2));
    }
    return lines;
}

const lines = printNodeLines(tree.rootNode);

// Ensure outputs directory exists
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
}

const { name, ext } = path.parse(arg);
const outFilename = `${name}_tree${ext}`;
const outPath = path.join(outputsDir, outFilename);

try {
    fs.writeFileSync(outPath, lines, 'utf8');
    console.log(`Parsed tree written to: ${outPath}`);
} catch (err) {
    console.error(`Failed to write output file: ${err.message}`);
    process.exit(4);
}