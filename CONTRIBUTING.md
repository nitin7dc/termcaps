# Contributing to TermCaps

Thanks for helping. The most useful contributions are:

- **Fixing a shortcut** that's wrong or out of date
- **Adding a shortcut** people actually use
- **Adding a new tool**, like tmux, Emacs, Kitty or WezTerm

There's no build step. Edit the files, open `index.html` in a browser, and you'll see your change.

## The one rule: check it in the real tool

Every shortcut on TermCaps has been tried in the actual program. Before you add or change one, try it yourself and say where you checked it in your pull request, for example "Ghostty 1.4 on macOS" or "Vim 9.1". Many tools can print their own shortcuts, and that's the best source:

```sh
ghostty +list-keybinds --default
tmux list-keys
```

## Add or fix a shortcut

All shortcuts live in [`data.js`](data.js). Find the right section and add a row:

```js
{ k: 'ctrl+o', d: 'Save', n: 'Asks for a file name.' }
```

The README has the [full key format](README.md#add-or-fix-a-shortcut). A few writing conventions keep the sheets consistent:

- **Describe what happens, in plain words.** "Split down", not "new_split:down".
- **Start with a verb** where you can, in sentence case, with no full stop.
- **Pairs match pairs.** Keys written as `w / b` go with a description like "Next / previous word".
- **Notes are optional.** Use `n` only for something people would trip over.

## Add a new tool

1. Add an entry to the `SHEETS` array in `data.js`:

   ```js
   {
     id: 'tmux',               // used in the URL: termcaps.com/#tmux
     name: 'tmux',             // spelled out in keycaps at the top of the page
     lede: 'One short sentence about the tool.',
     legend: [],               // optional key notation, see nano's entry
     tips: [],                 // optional tip boxes
     sections: [
       { title: 'Sessions', rows: [ /* ... */ ] },
     ],
   }
   ```

2. **Optional:** give it its own keycap color in `styles.css`. Copy one of the existing `--nano-*` blocks and add a matching `[data-tool='tmux']` rule. Without one, it uses the default amber.

3. Add the tool's name to the headline and `<title>` in `index.html`.

4. **The animated demo is optional.** A tool with no demo still gets its full sheet. To add one, see `demos.js`: a demo is a starting state, a script of steps (`key(keys, caption, change)`), and a `render` function that draws the state as HTML.

## Before you open a pull request

- Open `index.html` and check the new rows show up and look right
- Search for one of your shortcuts with <kbd>/</kbd>
- Check dark mode (the moon button) and a narrow window
- Make sure the browser console has no errors

Small pull requests are easiest to review. One tool or one section at a time is perfect.

## Ideas and bugs

[Open an issue](https://github.com/nitin7dc/termcaps/issues/new/choose) to request a tool or report a wrong shortcut.
