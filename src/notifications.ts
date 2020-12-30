import { LanguageClient } from 'coc.nvim'

export function onMessage(
  connection: LanguageClient,
  name: string,
  handler: (params: any) => Thenable<Record<string, any>>
): void {
  connection.onNotification(`tailwindcss/${name}`, async (params: any) => {
    const { _id, ...rest } = params
    connection.sendNotification(`tailwindcss/${name}Response`, {
      _id,
      ...(await handler(rest)),
    })
  })
}
