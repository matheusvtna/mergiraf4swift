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
let LangModule;
try {
    // if (extname === '.swift') {
    //     // LangModule = require('tree-sitter-swift');
    // } else 
        
        if (extname === '.js' || extname === '.cjs' || extname === '.mjs') {
        LangModule = require('tree-sitter-javascript');
    } else {
        // default to JavaScript parser
        LangModule = require('tree-sitter-javascript');
    }
} catch (err) {
    console.error(`Failed to load Tree-sitter language for extension '${extname}': ${err.message}`);
    process.exit(5);
}

const parser = new Parser();

function trySetLanguage(parser, mod) {
    const tried = [];
    const candidates = [mod, mod && mod.default, mod && mod.Language, mod && mod.javascript, mod && mod.Javascript];
    for (const cand of candidates) {
        if (!cand) continue;
        tried.push(Object.keys(cand));
        try {
            parser.setLanguage(cand);
            return;
        } catch (e) {
            // try next
        }
    }

    // Fallback: if `mod` looks like a raw grammar descriptor (has name/nodeTypeInfo),
    // try to require the package main or compiled binding inside the package directory.
    try {
        if (mod && typeof mod === 'object' && mod.name && mod.nodeTypeInfo) {
            const pkgJsonPath = require.resolve('tree-sitter-javascript/package.json');
            const pkgDir = path.dirname(pkgJsonPath);
            const tryPaths = [
                path.join(pkgDir, 'index.js'),
                path.join(pkgDir, 'binding.js'),
                path.join(pkgDir, 'lib', 'index.js'),
                path.join(pkgDir, 'build', 'Release', 'tree_sitter_javascript_binding.node'),
                path.join(pkgDir, 'build', 'Release', 'tree_sitter_javascript.node')
            ];
            for (const p of tryPaths) {
                try {
                    const candidate = require(p);
                    const keys = candidate && typeof candidate === 'object' ? Object.keys(candidate) : [typeof candidate];
                    tried.push(keys);
                    try {
                        parser.setLanguage(candidate);
                        return;
                    } catch (e) {
                        // continue
                    }
                } catch (e) {
                    // ignore
                }
            }
        }
    } catch (e) {
        // ignore
    }

    console.error('Failed to set parser language. Module did not export a valid language object.');
    console.error('Module export keys:', Object.keys(mod || {}));
    console.error('Tried candidate export keys:', tried);
    process.exit(6);
}

trySetLanguage(parser, LangModule);
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