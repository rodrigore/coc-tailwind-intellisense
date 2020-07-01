#

Coc integration for [Tailwind CSS IntelliSense](https://github.com/tailwindcss/intellisense) for version 0.4

## Install

In your vim/neovim, run command:

For [vim-plug](https://github.com/junegunn/vim-plug) users:

```vim
Plug 'rodrigore/coc-tailwind-intellisense', {'do': 'npm install'}
```

in your `.vimrc` or `init.vim`, then restart or source vimrc and run `:PlugInstall`.

## Features
* Autocomplete
![autocomplete](/screenshoots/autocomplete.png?raw=true "Autocomplete")
* Linting
![linting](/screenshoots/linter.png?raw=true "Linting")
* Hover Preview
![hovere](/screenshoots/hover.png?raw=true "Hover")

## Settings

* `tailwindCSS.enable` set to `false` to disable php language server. (`true` by default)
* Checkout the official [settings] (https://github.com/tailwindcss/intellisense/blob/master/README.md#settings)

## Troubleshooting
* Read [here](https://github.com/tailwindcss/intellisense/blob/master/README.md#troubleshooting)
