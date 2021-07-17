import monacoLoader from '@monaco-editor/loader'
import type Monaco from 'monaco-editor'
import type ts from 'typescript'
import { ParamType, Primitive } from '@/typings'
import type { ReturnPromisify, CodeParserResult, Param } from '@/typings'
import { race } from '@/shared/utils'


let cacheModelName: string
let cacheModel: Monaco.editor.ITextModel | null = null
export const getRuntimeModel = (name: string, code?: string): Monaco.editor.ITextModel => {
  if (cacheModelName === name) return cacheModel!
  if (cacheModel) {
    cacheModel.dispose()
    cacheModel = null
  }
  const uri = monaco.Uri.from({ path: `/rules/${name}.ts`, scheme: 'file' })
  cacheModel = monaco.editor.createModel(code || '', 'typescript', uri)
  cacheModelName = name
  return cacheModel
}

interface HackedTsWorker extends Monaco.languages.typescript.TypeScriptWorker {
  createSourceFile: ReturnPromisify<typeof ts["createSourceFile"]>
  getSyntaxKind: () => Promise<typeof ts.SyntaxKind>
}

export let monaco: typeof Monaco
let monacoPromise: Promise<typeof Monaco>

export const monacoGetter = () => {
  if (monaco) return Promise.resolve(monaco)
  if (monacoPromise) return monacoPromise
  // const segment = p/rocess.env.NODE_ENV === 'development' ? 'dev' : 'min'
  // TODO
  const segment = 'dev'
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

export const codeParser = async (name: string, code: string): Promise<CodeParserResult> => {
  await race(monacoGetter(), 5, 'monacoGetter')
  const runtimeModel = getRuntimeModel(name, code)
  await race(tsWorkerGetter(monaco), 5, 'tsWorkerGetter')
  if (!syntaxKind) {
    syntaxKind = await race(tsWorker.getSyntaxKind(), 2, 'getSyntaxKind')
  }
  const returnValue: CodeParserResult = {
    params: [],
    defined: false,
    js: '',
  }
  const sf = await tsWorker!.createSourceFile(runtimeModel.uri.toString(), runtimeModel.getValue(), monaco.languages.typescript.ScriptTarget.ESNext)
  const nodeContainer: { value: ts.CallExpression | null } = { value: null }
  const statements = Array.from(sf.statements)
  for(let i = 0; i < statements.length; i++) {
    if (nodeContainer.value) break
    findRuleDefineNode(statements[i], nodeContainer)
  }
  if (!nodeContainer.value) {
    return returnValue
  }
  returnValue.defined = true
  const output = await race(tsWorker.getEmitOutput(runtimeModel.uri.toString()), 5, 'getEmitOutput')
  if (output && output.outputFiles && output.outputFiles.length) {
    returnValue.js = output.outputFiles[0].text
  }
  const paramsContainer = { value: [] }
  receiveRuleParams(nodeContainer.value, statements, paramsContainer)
  returnValue.params = paramsContainer.value
  return returnValue
}

// Consider optimize
// https://github.com/microsoft/TypeScript/blob/main/src/compiler/parser.ts#L76


const defineRuleName = 'defineRule'
const findRuleDefineNode = (node: ts.Node, container: { value: ts.Node | null }) => {
  if (container.value) return
  switch(node.kind) {
    case syntaxKind.ExpressionStatement:
      findRuleDefineNode((node as ts.ExpressionStatement).expression, container)
      break
    case syntaxKind.CallExpression:
      const fnCallNode = node as ts.CallExpression
      const fnNameNode = fnCallNode.expression
      if (
        fnNameNode.kind === syntaxKind.Identifier
        && (fnNameNode as ts.Identifier).escapedText === defineRuleName
      ) {
        container.value = fnCallNode
        return
      }
  }
}

const receiveRuleParams = (defineNode: ts.CallExpression, allNodes: ts.Node[], container: { value: Param[] }) => {
  const firstArg = defineNode.arguments[0] as ts.ArrowFunction
  if (!firstArg) return
  const firstParam = firstArg.parameters[0]
  if (!firstParam) return
  const paramType = firstParam.type
  if (!paramType) return
  switch(paramType.kind) {
    case syntaxKind.TypeLiteral:
      receiveMembers(Array.from((paramType as ts.TypeLiteralNode).members), container)
      break
    case syntaxKind.TypeReference:
      const name = ((paramType as ts.TypeReferenceNode).typeName as ts.Identifier).escapedText as string
      findTypeWithName(name, allNodes, container)
  }
}

const findTypeWithName = (typeName: string, allNodes: ts.Node[], container: { value: Param[] } ) => {
  allNodes.find(node => {
    switch(node.kind) {
      case syntaxKind.InterfaceDeclaration:
        const ifaceNode = node as ts.InterfaceDeclaration
        if (ifaceNode.name.escapedText === typeName) {
          receiveMembers(Array.from(ifaceNode.members), container)
          return true
        }
        break
      case syntaxKind.TypeAliasDeclaration:
        const aliasNode = node as ts.TypeAliasDeclaration
        if (aliasNode.name.escapedText === typeName) {
          const aliasType = aliasNode.type
          if (aliasType.kind === syntaxKind.TypeReference) {
            findTypeWithName(((aliasType as ts.TypeReferenceNode).typeName as ts.Identifier).escapedText as string, allNodes, container)
          }
          if (aliasType.kind === syntaxKind.TypeLiteral) {
            receiveMembers(Array.from((aliasType as ts.TypeLiteralNode).members), container)
          }
          return true
        }
        break        
    }
    return false
  })
}

const normalizeValue = (v: any, type: ts.SyntaxKind): Primitive => {
  switch(type) {
    case syntaxKind.StringKeyword:
    case syntaxKind.StringLiteral:
      return String(v)
    case syntaxKind.NumberKeyword:
    case syntaxKind.NumericLiteral:
      return Number(v)
    case syntaxKind.BooleanKeyword:
    case syntaxKind.TrueKeyword:
    case syntaxKind.FalseKeyword:
      return Boolean(v)
  }
  return v
}

const normalizeStringLiteral = (v: string): any => {
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d*(\.\d*)?$/.test(v)) return Number(v)
  return String(v)
}


const whiteListJsDocTags = ['label', 'desc', 'default']
const receiveMembers = (members: ts.TypeElement[], container: { value: Param[] }) => {
  members.forEach(member => {
    if (member.kind !== syntaxKind.PropertySignature) return
    const anyMember = member as any
    const field: Partial<Param> = { prop: anyMember.name.escapedText }
    if (anyMember.questionToken) {
      field.required = false
    } else {
      field.required = true
    }
    if (anyMember.type) {
      switch(anyMember.type.kind) {
        case syntaxKind.StringKeyword:
          field.type = ParamType.STRING
          break
        case syntaxKind.NumberKeyword:
          field.type = ParamType.NUMBER
          break
        case syntaxKind.BooleanKeyword:
          field.type = ParamType.BOOLEAN
          break
        case syntaxKind.UnionType:
          field.type = ParamType.UNION
          if (anyMember.type && anyMember.type.types) {
            field.options = []
            anyMember.type.types.map((t: any) => {
              if (t.kind === syntaxKind.LiteralType) {
                field.options!.push(normalizeValue(t.literal.text, t.literal.kind))
              }
            })
          }
      }
    }

    if (anyMember.jsDoc && anyMember.jsDoc.length) {
      anyMember.jsDoc.forEach((jsdoc: any) => {
        if (jsdoc.kind === syntaxKind.JSDocComment && jsdoc.tags && jsdoc.tags.length) {
          jsdoc.tags.forEach((tag: any) => {
            if (tag.kind === syntaxKind.JSDocTag) {
              const name = tag.tagName.escapedText
              if (whiteListJsDocTags.includes(name)) {
                if (name === 'default') {
                  let defaultValue = normalizeValue(tag.comment, anyMember.type.kind)
                  if (field.type === ParamType.UNION) {
                    defaultValue = normalizeStringLiteral(defaultValue as string)
                    if ((field.options || []).includes(defaultValue)) {
                      field.defaultValue = defaultValue
                    }
                  } else {
                    field.defaultValue = defaultValue
                  }
                } else {
                  field[name as keyof Param] = tag.comment
                }
              }
            }
          })
        }
      })
    }
    container.value.push(field as Param)
  })
}