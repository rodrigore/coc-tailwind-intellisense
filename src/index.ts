import { ExtensionContext, LanguageClient, LanguageClientOptions, ServerOptions, services, TransportKind, workspace, Uri } from 'coc.nvim';
import { TextDocument, WorkspaceFolder } from 'vscode-languageserver-protocol';
import { registerConfigErrorHandler } from './registerConfigErrorHandler';
import { DEFAULT_LANGUAGES } from './languages';
import { onMessage } from './notifications';
import { createEmitter } from './emitter';
import isObject from './isObject';
import { dedupe } from './array';

let languages: Map<string, string[]> = new Map();

let _sortedWorkspaceFolders: string[] | undefined;

function getUserLanguages({ includeLanguages }): Record<string, string> {
  return isObject(includeLanguages) ? includeLanguages: {};
}

function sortedWorkspaceFolders(): string[] {
  if (_sortedWorkspaceFolders === void 0) {
    _sortedWorkspaceFolders = workspace.workspaceFolders
      ? workspace.workspaceFolders
          .map((folder) => {
            let result = folder.uri.toString();
            if (result.charAt(result.length - 1) !== '/') {
              result = result + '/';
            }
            return result;
          })
          .sort((a, b) => {
            return a.length - b.length;
          })
      : [];
  }
  return _sortedWorkspaceFolders;
}

workspace.onDidChangeWorkspaceFolders(
  () => (_sortedWorkspaceFolders = undefined)
);

function getOuterMostWorkspaceFolder(folder: WorkspaceFolder): WorkspaceFolder {
  let sorted = sortedWorkspaceFolders();
  for (let element of sorted) {
    let uri = folder.uri.toString();
    if (uri.charAt(uri.length - 1) !== '/') {
      uri = uri + '/';
    }
    if (uri.startsWith(element)) {
      const workdir = workspace.getWorkspaceFolder(element);
      if (workdir) {
        return workdir;
      }
    }
  }
  return folder;
}

export async function activate(context: ExtensionContext): Promise<void> {
  let {subscriptions} = context;
  const config = workspace.getConfiguration().get<any>('tailwindCSS', {}) as any;
  if (!config.enable) return;
  const file = context.asAbsolutePath('./lib-server/intellisense/packages/tailwindcss-intellisense/src/server/index.js');

  function bootWorkspaceClient(folder: WorkspaceFolder) {
    let serverOptions: ServerOptions = {
      module: file,
      transport: TransportKind.ipc,
      options: {
        cwd: workspace.root,
        execArgv: config.execArgv || []
      }
    };

    let clientOptions: LanguageClientOptions = {
      documentSelector: languages
        .get(folder.uri.toString())
        .map((language) => ({
          scheme: 'file',
          language,
          pattern: `${Uri.parse(folder.uri).fsPath}/**/*`,
        })),
      synchronize: {
        configurationSection: 'tailwindcss-intellisense',
      },
      outputChannelName: 'Tailwind CSS IntelliSense',
      diagnosticCollectionName: 'tailwindcss-intellisense',
      initializationOptions: {
        handledSchemas: ['file'],
        userLanguages: getUserLanguages(config),
      },
      middleware: {
      }
    };

    let client = new LanguageClient('tailwindcss-intellisense', 'Tailwind CSS IntelliSense', serverOptions, clientOptions);

    client.onReady().then(() => {
        workspace.showMessage('Tailwind CSS intellisense ready v0.5.10');

        let emitter = createEmitter(client);
        registerConfigErrorHandler(emitter);

        onMessage(client, 'getConfiguration', async (scope) => {
          return workspace.getConfiguration('tailwindCSS', scope);
        })
    });

    subscriptions.push(
      services.registLanguageClient(client)
    );
  };

  function didOpenTextDocument(document: TextDocument): void {
    let uri = Uri.parse(document.uri);

    if (uri.scheme !== 'file') {
      return;
    }

    let folder = workspace.getWorkspaceFolder(document.uri);
    // Files outside a folder can't be handled. This might depend on the language.
    // Single file languages like JSON might handle files outside the workspace folders.
    if (!folder) {
      return;
    }
    // If we have nested workspace folders we only start a server on the outer most workspace folder.
    folder = getOuterMostWorkspaceFolder(folder);

    if (!languages.has(folder.uri.toString())) {
      languages.set(
        folder.uri.toString(),
        dedupe([...DEFAULT_LANGUAGES, ...Object.keys(getUserLanguages(config))]),
      );
    }

    bootWorkspaceClient(folder);
  };

  workspace.onDidOpenTextDocument(didOpenTextDocument);
};
