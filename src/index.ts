import { LanguageClientOptions, ExtensionContext, LanguageClient, services, workspace } from 'coc.nvim';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('ltls');
  const isEnable = config.get<boolean>('enabled', true);
  if (!isEnable) {
    return;
  }

  const serverOptions = {
    command: '/home/dpriedel/projects/languagetool_languageserver/__main__.py', // run jls
  };
  const clientOptions: LanguageClientOptions = {
    documentSelector: ['text'], // run ltls on text files
  };
  const client = new LanguageClient(
    'ltls', // the id
    'languagetool', // the name of the language server
    serverOptions,
    clientOptions
  );
  context.subscriptions.push(services.registLanguageClient(client));
  client.onReady().then(() => {
    if (config.get<boolean>('startupMessage', false)) {
      return;
    }
    workspace.showMessage(`ltls: running `);
  });
}
