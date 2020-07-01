import {ExtensionContext, LanguageClient, LanguageClientOptions, ServerOptions, services, TransportKind, workspace} from 'coc.nvim';
import { createEmitter } from './emitter';
import { registerConfigErrorHandler } from './registerConfigErrorHandler';

export async function activate(context: ExtensionContext): Promise<void> {
  let {subscriptions} = context;
  const config = workspace.getConfiguration().get<any>('tailwindCSS', {}) as any;
  if (!config.enable) return;
  const file = context.asAbsolutePath('./lib/intellisense/src/server/index.js');
  const selector = ['php', 'blade', 'blade.php', 'html', 'vue'];

  let serverOptions: ServerOptions = {
    module: file,
    transport: TransportKind.ipc,
    options: {
      cwd: workspace.root,
      execArgv: config.execArgv || []
    }
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: selector,
    synchronize: {
      configurationSection: 'tailwindcss-intellisense',
    },
    outputChannelName: 'Tailwind CSS IntelliSense',
    diagnosticCollectionName: 'tailwindcss-intellisense',
    initializationOptions: {
      handledSchemas: ['file']
    },
    middleware: {
    }
  };

  let client = new LanguageClient('tailwindcss-intellisense', 'Tailwind CSS IntelliSense', serverOptions, clientOptions);

  client.onReady().then(() => {
      workspace.showMessage('Tailwind CSS intellisense ready!');

      let emitter = createEmitter(client);
      registerConfigErrorHandler(emitter);
  });

  subscriptions.push(
    services.registLanguageClient(client)
  );
}
