const { commands, workspace } = require('coc.nvim')

exports.activate = context => {
  let { nvim } = workspace

  let { logger } = context;
  logger.info(`Extension from ${context.extensionPath}`)

  context.subscriptions.push(commands.registerCommand('code.convertCodePoint', async () => {
    let [pos, line] = await nvim.eval('[coc#util#cursor(), getline(".")]')
    logger.info(`linea: ${line}`)

    let curr = pos[1] == 0 ? '' : line.slice(pos[1], pos[1] + 1)
    let code = curr.codePointAt(0)
    let str = code.toString(16)
    str = str.length == 4 ? str : '0'.repeat(4 - str.length) + str
    let result = `${line.slice(0, pos[1])}${'\\u' + str}${line.slice(pos[1] + 1)}`
    await nvim.call('setline', ['.', result])
  }))
}
