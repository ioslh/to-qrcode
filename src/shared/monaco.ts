import monacoLoader from '@monaco-editor/loader'
import type Monaco from 'monaco-editor'
import type ts from 'typescript'
import type { ReturnPromisify, CodeParserResult } from '@/typings'

interface HackedTsWorker extends Monaco.languages.typescript.TypeScriptWorker {
  createSourceFile: ReturnPromisify<typeof ts["createSourceFile"]>
  getSyntaxKind: () => Promise<typeof ts.SyntaxKind>
}

export let monaco: typeof Monaco
let monacoPromise: Promise<typeof Monaco>

export const monacoGetter = () => {
  if (monaco) return Promise.resolve(monaco)
  if (monacoPromise) return monacoPromise
  // const segment = process.env.NODE_ENV === 'development' ? 'dev' : 'min'
  const segment = 'min'
  monacoLoader.config({
    paths: {
      vs: `/monaco/${segment}/vs`
    }
  })
  return monacoPromise = monacoLoader.init().then((result) => {
    return monaco = result
  })
}

export let tsWorker: HackedTsWorker
let tsWorkerPromise: Promise<void> | undefined

export const tsWorkerGetter = (monaco: typeof Monaco): Promise<void> => {
  if (tsWorker) return Promise.resolve()
  if (tsWorkerPromise) return tsWorkerPromise
  return tsWorkerPromise = new Promise((resolve, reject) => {
    monaco.languages.typescript.getTypeScriptWorker().then(workerGetter => {
      workerGetter().then(worker => {
        tsWorker = worker as HackedTsWorker
        resolve()
      }).catch(() => {
        tsWorkerPromise = undefined
        reject()
      })
    }).catch(() => {
      tsWorkerPromise = undefined
      reject()
    })
  })
}

let syntaxKind: typeof ts.SyntaxKind

const filename = 'ts:filename/form.ts'
export const codeParser = async (code: string): Promise<CodeParserResult> => {
  await monacoGetter()
  console.log(1)
  await tsWorkerGetter(monaco)
  console.log(2)
  if (!syntaxKind) {
    syntaxKind = await tsWorker.getSyntaxKind()
  }
  console.log(3)
  const sf = await tsWorker!.createSourceFile(filename, code, monaco.languages.typescript.ScriptTarget.ESNext)
  console.log(4)
  const output = await tsWorker.getEmitOutput(filename)
  console.log(5)
  console.log(output)
  sf.statements.forEach(statement => {
    switch(statement.kind) {
      case syntaxKind.InterfaceDeclaration:
        if ((statement as any).name.escapedText === 'Form') {
          // receiveInterface(statement as ts.InterfaceDeclaration)
        }
    }
  })
  return {
    params: [],
    js: '',
  }
}