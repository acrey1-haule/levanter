const bot = require('../lib/events')
const {
  addSpace,
  textToStylist,
  getUptime,
  getRam,
  getDate,
  getPlatform,
} = require('../lib/')

bot.addCommand(
  {
    pattern: 'help ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
    const [date, time] = getDate()
    let CMD_HELP = `╭────────────────╮
						ʟᴇᴠᴀɴᴛᴇʀ
╰────────────────╯

╭────────────────
│ Prefix : ${ctx.PREFIX}
│ User : ${message.pushName}
│ Time : ${time}
│ Day : ${date.toLocaleString('en', { weekday: 'long' })}
│ Date : ${date.toLocaleDateString('hi')}
│ Version : ${ctx.VERSION}
│ Plugins : ${ctx.pluginsCount}
│ Ram : ${getRam()}
│ Uptime : ${getUptime('t')}
│ Platform : ${getPlatform()}
╰────────────────
╭────────────────
`

    // Always Online and Typing
    CMD_HELP += `│ Always Online: ${ctx.ALWAYS_ONLINE === 'true' ? 'Enabled' : 'Disabled'}\n`
    CMD_HELP += `│ Always Typing: ${ctx.ALWAYS_TYPING === 'true' ? 'Enabled' : 'Disabled'}\n`
    
    // Auto Status View
    CMD_HELP += `│ Auto Status View: ${ctx.AUTO_STATUS_VIEW === 'true' ? 'Enabled' : 'Disabled'}\n`
    
    // React Status
    CMD_HELP += `│ React to Status: 🌺🌻🌷🌼🪻⚘️🤙👍\n`

    // Random Reactions
    CMD_HELP += `│ Random React to Messages: 🎉⚽️🎉👍\n`

    // Tag All People in Group
    CMD_HELP += `│ Tag All People in Group: ${ctx.TELL_ALL_PEOPLE === 'true' ? 'Enabled' : 'Disabled'}\n`

    sorted.map(async (command, i) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        CMD_HELP += `│ ${i + 1} ${addSpace(i + 1, sorted.length)}${textToStylist(
          command.name.toUpperCase(),
          'mono'
        )}\n`
      }
    })

    CMD_HELP += `╰────────────────`
    return await message.send('```' + CMD_HELP + '```')
  }
)

bot.addCommand(
  {
    pattern: 'list ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    let msg = ''
    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
    sorted.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        msg += `${index + 1} ${command.name}\n${command.desc}\n\n`
      }
    })
    
    // Always Online and Typing
    msg += `Always Online: ${ctx.ALWAYS_ONLINE === 'true' ? 'Enabled' : 'Disabled'}\n`
    msg += `Always Typing: ${ctx.ALWAYS_TYPING === 'true' ? 'Enabled' : 'Disabled'}\n`
    
    // Auto Status View
    msg += `Auto Status View: ${ctx.AUTO_STATUS_VIEW === 'true' ? 'Enabled' : 'Disabled'}\n`
    
    // Random Reactions
    msg += `Random Reactions to Messages: 🎉⚽️🎉👍\n`

    await message.send('```' + msg.trim() + '```')
  }
)

bot.addCommand(
  {
    pattern: 'menu ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const commands = {}
    ctx.commands.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        let cmdType = command.type.toLowerCase()
        if (!commands[cmdType]) commands[cmdType] = []
        let isDiabled = command.active === false
        let cmd = command.name.trim()
        commands[cmdType].push(isDiabled ? cmd + ' [disabled]' : cmd)
      }
    })
    const [date, time] = getDate()
    let msg = `\`\`\`╭═══ LEVANTER ═══⊷
┃❃╭──────────────
┃❃│ Prefix : ${ctx.PREFIX}
┃❃│ User : ${message.pushName}
┃❃│ Time : ${time}
┃❃│ Day : ${date.toLocaleString('en', { weekday: 'long' })}
┃❃│ Date : ${date.toLocaleDateString('hi')}
┃❃│ Version : ${ctx.VERSION}
┃❃│ Plugins : ${ctx.pluginsCount}
┃❃│ Ram : ${getRam()}
┃❃│ Uptime : ${getUptime('t')}
┃❃│ Platform : ${getPlatform()}
┃❃╰───────────────
╰═════════════════⊷\`\`\`\n`

    // Always Online, Typing, Status View, Reactions
    msg += `┃❃│ Always Online: ${ctx.ALWAYS_ONLINE === 'true' ? 'Enabled' : 'Disabled'}\n`
    msg += `┃❃│ Always Typing: ${ctx.ALWAYS_TYPING === 'true' ? 'Enabled' : 'Disabled'}\n`
    msg += `┃❃│ Auto Status View: ${ctx.AUTO_STATUS_VIEW === 'true' ? 'Enabled' : 'Disabled'}\n`
    msg += `┃❃│ React to Status: 🌺🌻🌷🌼🪻⚘️🤙👍\n`
    msg += `┃❃│ Random React to Messages: 🎉⚽️🎉👍\n`

    if (match && commands[match]) {
      msg += ` ╭─❏ ${textToStylist(match.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[match])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────`

      return await message.send(msg)
    }
    for (const command in commands) {
      msg += ` ╭─❏ ${textToStylist(command.toLowerCase(), 'smallcaps')} ❏\n`
      for (const plugin of commands[command])
        msg += ` │ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`
      msg += ` ╰─────────────────\n`
    }
    await message.send(msg.trim())
  }
)
