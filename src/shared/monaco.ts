import monacoLoader from '@monaco-editor/loader'
import type Monaco from 'monaco-editor'
import type ts from 'typescript'

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
    monaco = result
    // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-configure-javascript-defaults
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    })
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowJs: true,
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      checkJs: true,
      noLib: true,
      lib: ['ES5', 'ES2015', 'ESNext']
    })
    return monaco
  })
}