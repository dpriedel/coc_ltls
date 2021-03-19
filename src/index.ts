import { LanguageClientOptions, ExtensionContext, LanguageClient, services, workspace } from 'coc.nvim';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('ltls');
  const isEnable = config.get<boolean>('enabled', true);
  if (!isEnable) {
    return;
  }

  const language = config.get<string>('language', 'en');
  const command = config.get<string>('command');
  const lt_command = config.get<string>('lt_command');
  const lt_port = config.get<string>('lt_port');
  const ngrams = config.get<string>('n-grams');
  const word2vec = config.get<string>('word2vec');

  const cmd: string = command;
  let args: [string] = [];

  if (lt_command != '') {
    args = args.concat(['-c', lt_command]);
  }

  if (lt_port != '') {
    args = args.concat(['-p', lt_port]);
  }

  if (language != '') {
    args = args.concat(['-l', language]);
  }

  if (ngrams != '') {
    args = args.concat(['--languageModel', ngrams]);
  }

  if (word2vec != '') {
    args = args.concat(['--word2vecModel', word2vec]);
  }

  const serverOptions = {
    command: cmd, // run jls
    args: args,
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
    if (!config.get<boolean>('startupMessage', false)) {
      return;
    }
    workspace.showMessage(`ltls: running `);
  });
}
