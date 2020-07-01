import { Position } from 'vscode-languageserver-protocol'
import { Uri, workspace } from 'coc.nvim'
import { NotificationEmitter } from './emitter'

export function registerConfigErrorHandler(emitter: NotificationEmitter) {
    emitter.on('configError', async ({ message, file, line }) => {
        workspace.showMessage(
            `Tailwind CSS: ${message}`
        )

        workspace.jumpTo(
            Uri.file(file).toString(),
            Position.create(line - 1, 0),
        )
    });
}
