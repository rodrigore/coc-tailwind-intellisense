![banner](/screenshots/banner.jpeg?raw=true "banner")

Coc integration for [Tailwind CSS IntelliSense](https://github.com/tailwindcss/intellisense) for version 0.56

## Install

```vim
:CocInstall https://github.com/rodrigore/coc-tailwind-intellisense
```
or if you are a [vim-plug](https://github.com/junegunn/vim-plug) user, add:

```vim
Plug 'rodrigore/coc-tailwind-intellisense', {'do': 'npm install'}
```

in your `.vimrc` or `init.vim`, then restart or source vimrc and run `:PlugInstall`.

## Features
* Autocomplete
![autocomplete](/screenshots/autocomplete.png?raw=true "Autocomplete")
* Linting
![linting](/screenshots/linter.png?raw=true "Linting")
* Hover Preview
![hover](/screenshots/hover.png?raw=true "Hover")

## Features not working
* Since version 0.42 tailwind have the ability to show color decorator. At the time of this writing vim/neovim/coc.nvim don't support decorator.

## Settings

* `tailwindCSS.enable` set to `false` to disable tailwind intellisense server. (`true` by default)
* Official [settings](https://github.com/tailwindcss/intellisense/blob/master/README.md#settings)

## Troubleshooting
* Read [here](https://github.com/tailwindcss/intellisense/blob/master/README.md#troubleshooting)
