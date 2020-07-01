import { Position, Range } from 'vscode-languageserver-protocol'
import { Uri, workspace, Window } from 'coc.nvim'
import { NotificationEmitter } from './emitter'

export function registerConfigErrorHandler(emitter: NotificationEmitter) {
    emitter.on('configError', async ({ message, file, line }) => {
        // const actions: string[] = file ? ['View'] : [];

        workspace.showMessage(
            `Tailwind CSS: ${message}`
        )

        // if (action === 'View') {
            workspace.jumpTo(
                Uri.file(file).toString(),
                Position.create(line - 1, 0),
            ).then(() => {
                return workspace.nvim.call('bufnr', '%')
            });
        // }
    });
}
