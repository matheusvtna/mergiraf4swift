import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const Parser = require('tree-sitter');

// Resolve script directory so `inputs/` and `outputs/` are relative to this file
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const inputsDir = path.join(scriptDir, 'inputs');
const outputsDir = path.join(scriptDir, 'outputs');

const arg = process.argv[2];
if (!arg) {
    console.error('Usage: node src/tree-builder.js <input-filename>');
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

// Select parser language based on file extension
const extname = path.extname(arg).toLowerCase();
const language = extname.split('.').pop();
const LangModule = require(`tree-sitter-${language}`);
const parser = new Parser();

function trySetLanguage(parser, mod) {   
    try {
        parser.setLanguage(mod);
        return;    
    } catch (e) {
        console.error('Failed to set parser language. Error:', e.message);
        console.error('Module export keys:', Object.keys(mod || {}));
        process.exit(6);
    }
}
trySetLanguage(parser, LangModule);

// Parse the source code
const tree = parser.parse(sourceCode);

function renderTree() {
    // Traverse using a TreeCursor to mimic the playground traversal order.
    const cursor = tree.walk();
    const rows = [];
    let row = "";
    let finishedRow = false;
    let visitedChildren = false;
    let indentLevel = 0;

    for (;;) {
        let displayName = null;
        if (cursor.nodeIsMissing) {
            const nodeTypeText = cursor.nodeIsNamed ? cursor.nodeType : `"${cursor.nodeType}"`;
            displayName = `MISSING ${nodeTypeText}`;
        } else if (cursor.nodeIsNamed) {
            displayName = cursor.nodeType;
        } else {
            // anonymous / punctuation nodes: do not display
            displayName = null;
        }

        if (visitedChildren) {
            if (displayName) {
                finishedRow = true;
            }

            if (cursor.gotoNextSibling()) {
                visitedChildren = false;
            } else if (cursor.gotoParent()) {
                visitedChildren = true;
                indentLevel--;
            } else {
                break;
            }
        } else {
            if (displayName) {
                if (finishedRow) {
                    if (row) rows.push(row);
                    finishedRow = false;
                }

                const start = cursor.startPosition;
                const end = cursor.endPosition;
                let fieldName = cursor.currentFieldName || '';
                if (fieldName) fieldName += ': ';

                row = `${'  '.repeat(indentLevel)}${fieldName}${displayName} [${start.row}, ${start.column}] - [${end.row}, ${end.column}]`;
                finishedRow = true;
            }

            if (cursor.gotoFirstChild()) {
                visitedChildren = false;
                indentLevel++;
            } else {
                visitedChildren = true;
            }
        }
    }

    if (finishedRow && row) rows.push(row);
    try {
        cursor.delete();
    } catch (e) {
        // ignore if already freed
    }
    return rows;
}

const lines = renderTree();

// Ensure outputs directory exists
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
}

const { name } = path.parse(arg);
const outFilename = `${name}_tree.txt`;
const outPath = path.join(outputsDir, outFilename);

try {
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    console.log(`Parsed tree written to: ${outPath}`);
} catch (err) {
    console.error(`Failed to write output file: ${err.message}`);
    process.exit(4);
}