/*
  Shortcut data.

  Key spec mini-language (used in `k`):
    "ctrl+o"            one chord (modifiers joined with +)
    "ctrl+w w"          a sequence: press ctrl+w, then w
    "d d"               two separate key presses
    "w / b"             a pair, read with the "Next / previous" style description
    "f {char}"          {name} is a placeholder you fill in
    ":wq", "/{text}"    anything starting with : / or ? is a command
    ["a", "b"]          alternatives, shown with "or"
  `c` holds text you type or paste (config lines, shell commands). It renders as a copy button.
  `gnu: true` marks nano shortcuts that the macOS built-in pico does not have.
  "prefix c"          tmux: press the sheet's `prefix` key (ctrl+b), let go, then c
*/
window.SHEETS = [
  {
    id: 'nano',
    name: 'nano',
    native: true,
    lede: 'The editor that keeps its shortcuts on screen.',
    legend: [
      { keys: '^', text: 'in nano’s help bar means Control.' },
      { keys: 'M-', text: 'means Alt. On a Mac, that’s Option.' },
    ],
    tips: [
      {
        text: 'On recent macOS, the <code>nano</code> command opens pico, a close cousin. Shortcuts tagged <span class="tag">GNU nano</span> need the real thing.',
        cmd: 'brew install nano',
        gnuToggle: true,
      },
      {
        text: 'Using Ghostty? Add this to your config so Option works as Alt for the ⌥ shortcuts.',
        cmd: 'macos-option-as-alt = true',
      },
    ],
    sections: [
      {
        title: 'Save & exit',
        rows: [
          { k: 'ctrl+o', d: 'Save', n: 'Asks for a file name. Press return to keep the current one.' },
          { k: 'ctrl+s', d: 'Save without asking', gnu: true },
          { k: 'ctrl+x', d: 'Exit', n: 'Offers to save first if there are unsaved changes.' },
          { k: 'ctrl+r', d: 'Insert another file at the cursor' },
          { k: 'alt+< / alt+>', d: 'Previous / next open file', n: 'Open several at once with <code>nano a.txt b.txt</code>.', gnu: true },
        ],
      },
      {
        title: 'Move around',
        rows: [
          { k: 'ctrl+a / ctrl+e', d: 'Start / end of the line' },
          { k: 'ctrl+p / ctrl+n', d: 'Up / down one line', n: 'The arrow keys work too.' },
          { k: 'ctrl+b / ctrl+f', d: 'Back / forward one character' },
          { k: 'ctrl+space', d: 'Forward one word' },
          { k: 'alt+space', d: 'Back one word', gnu: true },
          { k: 'ctrl+y / ctrl+v', d: 'Page up / page down' },
          { k: 'alt+\\ / alt+/', d: 'First / last line of the file', gnu: true },
          { k: ['ctrl+_', 'alt+g'], d: 'Go to a line number', n: 'Type the number, then press return.', gnu: true },
          { k: 'alt+]', d: 'Jump to the matching bracket', gnu: true },
        ],
      },
      {
        title: 'Cut, copy & paste',
        rows: [
          { k: 'ctrl+k', d: 'Cut the line', n: 'Press it again to cut more lines into the same clipboard.' },
          { k: 'ctrl+u', d: 'Paste' },
          { k: 'alt+6', d: 'Copy the line', gnu: true },
          { k: 'ctrl+6', d: 'Start selecting', n: 'Move the cursor to grow the selection, then cut or copy it.' },
          { k: 'alt+t', d: 'Cut from the cursor to the end of the file', gnu: true },
        ],
      },
      {
        title: 'Edit',
        rows: [
          { k: 'alt+u', d: 'Undo', gnu: true },
          { k: 'alt+e', d: 'Redo', gnu: true },
          { k: 'ctrl+d', d: 'Delete the character under the cursor' },
          { k: 'alt+3', d: 'Comment or uncomment the line', gnu: true },
          { k: 'alt+} / alt+{', d: 'Indent / unindent', n: 'Select several lines first to shift a whole block.', gnu: true },
          { k: 'ctrl+j', d: 'Justify the paragraph' },
          { k: 'ctrl+]', d: 'Complete the word you’re typing', gnu: true },
          { k: 'ctrl+t', d: 'Run a command or the spell checker', n: 'GNU nano calls it Execute. Pico calls it To Spell.' },
        ],
      },
      {
        title: 'Search & replace',
        rows: [
          { k: 'ctrl+w', d: 'Search forward' },
          { k: 'ctrl+q', d: 'Search backward', gnu: true },
          { k: 'alt+w / alt+q', d: 'Next / previous match', gnu: true },
          { k: 'ctrl+\\', d: 'Search and replace', n: 'At the “Replace this instance?” prompt, press A to replace them all.', gnu: true },
          { k: 'ctrl+c', d: 'Show the cursor position' },
        ],
      },
      {
        title: 'View & help',
        rows: [
          { k: 'ctrl+g', d: 'Open the full help' },
          { k: 'alt+n', d: 'Show or hide line numbers', gnu: true },
          { k: 'alt+s', d: 'Turn soft wrapping on or off', gnu: true },
          { k: 'alt+p', d: 'Show tabs and trailing spaces', gnu: true },
          { k: 'alt+y', d: 'Turn syntax colors on or off', gnu: true },
          { k: 'alt+m', d: 'Turn mouse support on or off', gnu: true },
          { k: 'alt+x', d: 'Hide the help bar for more room', gnu: true },
        ],
      },
      {
        title: 'Start nano',
        rows: [
          { c: 'nano +42 notes.txt', d: 'Open a file at line 42' },
          { c: 'nano -v notes.txt', d: 'Open read-only, so you can’t change it by accident' },
          { c: 'nano -l notes.txt', d: 'Open with line numbers', gnu: true },
          { c: 'nano -m notes.txt', d: 'Open with mouse support, so you can click to move' },
        ],
      },
      {
        title: 'Settings that stick',
        note: 'Put these lines in <code>~/.nanorc</code>. They apply every time GNU nano starts.',
        gnu: true,
        rows: [
          { c: 'set linenumbers', d: 'Always show line numbers' },
          { c: 'set mouse', d: 'Click to place the cursor' },
          { c: 'set autoindent', d: 'Keep the indent when you start a new line' },
          { c: 'set tabsize 4\nset tabstospaces', d: 'Make Tab insert four spaces' },
          { c: 'set softwrap', d: 'Wrap long lines on screen' },
          { c: 'include "/opt/homebrew/share/nano/*.nanorc"', d: 'Syntax colors for nano installed with Homebrew' },
        ],
      },
    ],
  },

  {
    id: 'vi',
    name: 'vi',
    lede: 'Every key is a command until you press i.',
    legend: [
      { mode: 'Normal', text: 'Where you start. Keys move the cursor and edit.' },
      { mode: 'Insert', text: 'Keys type text. Press <b>i</b> to enter and <b>esc</b> to leave.' },
      { mode: 'Visual', text: 'Select text with <b>v</b>, then act on the selection.' },
      { mode: 'Command', text: 'Type <b>:</b> and a command, then press return.' },
    ],
    tips: [
      { text: 'Capital letters mean Shift, so <b>A</b> is Shift and a. Put a number first to repeat: <b>3dd</b> deletes three lines.' },
      { text: 'On macOS, <code>vi</code> opens Vim 9.1, so every shortcut on this page works.' },
    ],
    sections: [
      {
        title: 'Switch modes',
        note: 'Lost? Press esc to get back to Normal mode.',
        rows: [
          { k: 'i', d: 'Insert before the cursor' },
          { k: 'a', d: 'Insert after the cursor' },
          { k: 'I / A', d: 'Insert at the start / end of the line' },
          { k: 'o / O', d: 'Start a new line below / above' },
          { k: 'v', d: 'Select characters' },
          { k: 'V', d: 'Select whole lines' },
          { k: 'ctrl+v', d: 'Select a block of columns' },
          { k: 'R', d: 'Type over existing text' },
          { k: 'esc', d: 'Back to Normal mode' },
        ],
      },
      {
        title: 'Save & quit',
        rows: [
          { k: ':w', d: 'Save' },
          { k: ':q', d: 'Quit' },
          { k: [':wq', ':x', 'Z Z'], d: 'Save and quit' },
          { k: [':q!', 'Z Q'], d: 'Quit and throw away your changes' },
          { k: ':w {file}', d: 'Save as a new file' },
          { k: ':e {file}', d: 'Open another file' },
          { k: ':e!', d: 'Reload the file, dropping your changes' },
          { k: ':wa / :qa', d: 'Save all / quit all' },
        ],
      },
      {
        title: 'Move',
        rows: [
          { k: 'h j k l', d: 'Left, down, up, right' },
          { k: 'w / b', d: 'Next / previous word' },
          { k: 'e', d: 'End of the word' },
          { k: '0 / ^ / $', d: 'Start of line / first character / end of line' },
          { k: 'g g / G', d: 'First line / last line' },
          { k: [':42', '4 2 G'], d: 'Go to line 42' },
          { k: 'ctrl+d / ctrl+u', d: 'Half a page down / up' },
          { k: 'ctrl+f / ctrl+b', d: 'A full page down / up' },
          { k: '%', d: 'Jump to the matching bracket' },
          { k: 'f {char} / t {char}', d: 'Jump to / just before a character on the line', n: 'Press ; to repeat the jump, or , to go back.' },
          { k: '{ / }', d: 'Previous / next paragraph' },
          { k: 'H / M / L', d: 'Top / middle / bottom of the screen' },
          { k: 'z z', d: 'Scroll so the cursor is in the middle' },
          { k: 'ctrl+o / ctrl+i', d: 'Back / forward through places you jumped' },
        ],
      },
      {
        title: 'Edit',
        rows: [
          { k: 'x', d: 'Delete the character' },
          { k: 'd d', d: 'Delete (cut) the line' },
          { k: 'd w', d: 'Delete to the start of the next word' },
          { k: 'D', d: 'Delete to the end of the line' },
          { k: 'c w', d: 'Change to the end of the word' },
          { k: 'c c', d: 'Change the whole line' },
          { k: 'y y', d: 'Copy (yank) the line' },
          { k: 'p / P', d: 'Paste after / before the cursor' },
          { k: 'u', d: 'Undo' },
          { k: 'ctrl+r', d: 'Redo' },
          { k: '.', d: 'Repeat the last change' },
          { k: '> > / < <', d: 'Indent / outdent the line' },
          { k: 'J', d: 'Join the next line onto this one' },
          { k: 'r {char}', d: 'Replace one character' },
          { k: '~', d: 'Flip between upper and lower case' },
          { k: '3 d d', d: 'Delete three lines', n: 'Counts work with most commands: <b>5j</b>, <b>2dw</b>, <b>10x</b>.' },
        ],
      },
      {
        title: 'Text objects',
        note: 'Verb, then i (inside) or a (around), then a thing. Works from anywhere inside it.',
        rows: [
          { k: 'c i w', d: 'Change the word under the cursor' },
          { k: 'd a w', d: 'Delete the word and the space after it' },
          { k: 'c i "', d: 'Change the text inside quotes' },
          { k: 'd i (', d: 'Delete the text inside parentheses' },
          { k: 'y i {', d: 'Copy the text inside braces' },
          { k: 'c i t', d: 'Change the text inside an HTML tag' },
          { k: 'd a p', d: 'Delete the paragraph' },
          { k: 'v i "', d: 'Select the text inside quotes' },
        ],
      },
      {
        title: 'Search & replace',
        rows: [
          { k: '/{text}', d: 'Search forward' },
          { k: '?{text}', d: 'Search backward' },
          { k: 'n / N', d: 'Next / previous match' },
          { k: '* / #', d: 'Search for the word under the cursor, forward / backward' },
          { k: ':%s/old/new/g', d: 'Replace everywhere in the file' },
          { k: ':%s/old/new/gc', d: 'Replace everywhere, confirming each one' },
          { k: ':s/old/new/g', d: 'Replace on the current line only' },
          { k: ':noh', d: 'Clear the search highlight' },
        ],
      },
      {
        title: 'Visual mode',
        note: 'Select with v, V or ctrl+v first, then:',
        rows: [
          { k: 'y / d / c', d: 'Copy / delete / change the selection' },
          { k: '> / <', d: 'Indent / outdent the selection' },
          { k: 'o', d: 'Jump to the other end of the selection' },
          { k: 'g v', d: 'Select the last selection again' },
          { k: 'ctrl+v I', d: 'Type on many lines at once', n: 'After ctrl+v, press j to extend down, press I, type, then press esc.' },
        ],
      },
      {
        title: 'Windows, buffers & tabs',
        rows: [
          { k: ':sp / :vsp', d: 'Split the window across / side by side' },
          { k: 'ctrl+w w', d: 'Go to the next window' },
          { k: 'ctrl+w {hjkl}', d: 'Go to the window in that direction' },
          { k: 'ctrl+w q', d: 'Close the window' },
          { k: ':ls', d: 'List open files (buffers)' },
          { k: ':bn / :bp', d: 'Next / previous buffer' },
          { k: ':tabnew', d: 'Open a new tab' },
          { k: 'g t / g T', d: 'Next / previous tab' },
        ],
      },
      {
        title: 'Marks & macros',
        rows: [
          { k: 'm a', d: 'Set mark a (any letter works)' },
          { k: "' a / ` a", d: 'Jump to the line / exact spot of mark a' },
          { k: 'q a', d: 'Record a macro into register a' },
          { k: 'q', d: 'Stop recording' },
          { k: '@ a', d: 'Play macro a' },
          { k: '@ @', d: 'Play the last macro again' },
          { k: ':reg', d: 'Show what’s in every register' },
        ],
      },
      {
        title: 'Settings',
        note: 'Type these in Vim, or put them in <code>~/.vimrc</code> without the colon.',
        rows: [
          { k: ':set number', d: 'Show line numbers' },
          { k: ':set relativenumber', d: 'Number lines by distance from the cursor' },
          { k: ':syntax on', d: 'Turn on syntax colors' },
          { k: ':set ignorecase smartcase', d: 'Search ignores case, unless you type a capital' },
          { k: ':set hlsearch incsearch', d: 'Highlight matches as you type' },
          { k: ':set expandtab tabstop=4 shiftwidth=4', d: 'Indent with four spaces' },
          { k: ':set mouse=a', d: 'Click and scroll with the mouse' },
        ],
      },
    ],
  },

  {
    id: 'ghostty',
    name: 'ghostty',
    lede: 'A fast, native terminal with splits, tabs and a drop-down window.',
    legend: [],
    tips: [
      {
        text: 'These are the macOS defaults in Ghostty 1.4. To see your own shortcuts, including any you’ve added:',
        cmd: 'ghostty +list-keybinds',
      },
    ],
    sections: [
      {
        title: 'Tabs & windows',
        rows: [
          { k: 'cmd+t', d: 'New tab' },
          { k: 'cmd+n', d: 'New window' },
          { k: 'cmd+shift+[ / cmd+shift+]', d: 'Previous / next tab', n: 'ctrl+tab and ctrl+shift+tab work too.' },
          { k: 'cmd+1-8', d: 'Go to tab 1 to 8' },
          { k: 'cmd+9', d: 'Go to the last tab' },
          { k: 'cmd+w', d: 'Close the split you’re in', n: 'Closes the tab if it’s the only split.' },
          { k: 'cmd+alt+w', d: 'Close the tab' },
          { k: 'cmd+shift+w', d: 'Close the window' },
          { k: 'cmd+z', d: 'Reopen what you just closed', n: 'Works for tabs, splits and windows. cmd+shift+t does the same.' },
          { k: ['cmd+enter', 'cmd+ctrl+f'], d: 'Full screen' },
          { k: 'cmd+q', d: 'Quit Ghostty' },
        ],
      },
      {
        title: 'Splits',
        rows: [
          { k: 'cmd+d', d: 'Split right' },
          { k: 'cmd+shift+d', d: 'Split down' },
          { k: 'cmd+[ / cmd+]', d: 'Previous / next split' },
          { k: 'cmd+alt+arrows', d: 'Go to the split in that direction' },
          { k: 'cmd+ctrl+arrows', d: 'Resize the split' },
          { k: 'cmd+ctrl+=', d: 'Make all splits the same size' },
          { k: 'cmd+shift+enter', d: 'Zoom the split to fill the tab', n: 'Press again to put it back.' },
        ],
      },
      {
        title: 'Scroll & output',
        rows: [
          { k: 'cmd+k', d: 'Clear the screen and scrollback' },
          { k: 'cmd+up / cmd+down', d: 'Jump to the previous / next prompt', n: 'Uses shell integration, which is on by default for zsh, bash and fish.' },
          { k: 'cmd+home / cmd+end', d: 'Scroll to the top / bottom' },
          { k: 'cmd+pgup / cmd+pgdn', d: 'Scroll up / down a page' },
          { k: 'cmd+shift+j', d: 'Save the screen to a file and paste its path', n: 'Handy for handing long output to another program.' },
        ],
      },
      {
        title: 'Find',
        rows: [
          { k: 'cmd+f', d: 'Search the scrollback' },
          { k: 'cmd+g / cmd+shift+g', d: 'Next / previous match' },
          { k: 'cmd+e', d: 'Search for the selected text' },
          { k: 'esc', d: 'Close the search bar' },
        ],
      },
      {
        title: 'Select, copy & paste',
        rows: [
          { k: 'cmd+c / cmd+v', d: 'Copy / paste' },
          { k: 'cmd+a', d: 'Select everything' },
          { k: 'shift+arrows', d: 'Grow the selection' },
          { k: 'cmd+shift+v', d: 'Paste the selected text' },
        ],
      },
      {
        title: 'Edit the command line',
        rows: [
          { k: 'cmd+left / cmd+right', d: 'Start / end of the line' },
          { k: 'alt+left / alt+right', d: 'Back / forward one word' },
          { k: 'cmd+bksp', d: 'Delete back to the start of the line' },
        ],
      },
      {
        title: 'Text size, config & tools',
        rows: [
          { k: 'cmd+= / cmd+-', d: 'Bigger / smaller text' },
          { k: 'cmd+0', d: 'Reset the text size' },
          { k: 'cmd+shift+p', d: 'Command palette', n: 'Find any action by name.' },
          { k: 'cmd+,', d: 'Open the config file' },
          { k: 'cmd+shift+,', d: 'Reload the config' },
          { k: 'cmd+alt+i', d: 'Open the terminal inspector' },
        ],
      },
      {
        title: 'Config file',
        note: 'Ghostty reads <code>~/.config/ghostty/config.ghostty</code>, one setting per line. Older setups may use a file named <code>config</code> in the same folder. Press ⌘⇧, to reload after editing.',
        rows: [
          { c: 'font-family = "JetBrains Mono"\nfont-size = 16', d: 'Pick a font and size' },
          { c: 'theme = light:Catppuccin Latte,dark:Catppuccin Mocha', d: 'Follow macOS light and dark mode' },
          { c: 'macos-option-as-alt = true', d: 'Make Option work as Alt', n: 'Needed for Alt shortcuts in nano, Emacs and readline.' },
          { c: 'background-opacity = 0.9\nbackground-blur = true', d: 'See-through, frosted background' },
          { c: 'window-padding-x = 12\nwindow-padding-y = 8', d: 'Add room around the text' },
          { c: 'cursor-style = bar', d: 'Use a thin bar cursor' },
          { c: 'copy-on-select = clipboard', d: 'Copy text as soon as you select it' },
          { c: 'mouse-hide-while-typing = true', d: 'Hide the pointer while you type' },
          { c: 'keybind = global:cmd+backquote=toggle_quick_terminal', d: 'Drop-down terminal from any app with ⌘`', n: 'macOS asks for Accessibility access the first time.' },
          { c: 'keybind = ctrl+a>c=new_tab', d: 'Chain keys like tmux: ctrl+a, then c' },
        ],
      },
      {
        title: 'Command line',
        note: 'The <code>ghostty</code> command is on your PATH inside Ghostty. Elsewhere, use <code>/Applications/Ghostty.app/Contents/MacOS/ghostty</code>.',
        rows: [
          { c: 'ghostty +list-themes', d: 'Preview every built-in theme' },
          { c: 'ghostty +list-fonts', d: 'List the fonts Ghostty can use' },
          { c: 'ghostty +list-keybinds --default', d: 'Print every default shortcut' },
          { c: 'ghostty +edit-config', d: 'Open your config in $EDITOR' },
          { c: 'ghostty +validate-config', d: 'Check your config for mistakes' },
          { c: 'ghostty +explain-config font-size', d: 'Read the docs for one setting' },
        ],
      },
    ],
  },

  {
    id: 'tmux',
    name: 'tmux',
    prefix: 'ctrl+b',
    lede: 'Sessions that keep running after you close the terminal.',
    legend: [
      { keys: 'ctrl+b', text: 'is the prefix. tmux waits for one more key after it.' },
      { keys: 'prefix d', text: 'means press ctrl+b, let go, then press d.' },
    ],
    tips: [
      {
        text: 'Working on a server over SSH? Start tmux there with this. If the connection drops, your work keeps running. Log back in and run it again to pick up where you left off.',
        cmd: 'tmux new -A -s work',
      },
      {
        text: 'These are the defaults in tmux 3.4 and later. To list your own, including any you’ve added:',
        cmd: 'tmux list-keys',
      },
    ],
    sections: [
      {
        title: 'Start & attach',
        note: 'Type these in your shell.',
        rows: [
          { c: 'tmux new -s work', d: 'Start a session named work' },
          { c: 'tmux new -A -s work', d: 'Attach to work, or start it if it isn’t running' },
          { c: 'tmux ls', d: 'List running sessions' },
          { c: 'tmux a', d: 'Attach to the session you used last' },
          { c: 'tmux a -t work', d: 'Attach to the session named work' },
          { c: 'tmux kill-session -t work', d: 'End the session named work' },
          { c: 'tmux kill-server', d: 'End every session', n: 'Anything still running inside them stops too.' },
        ],
      },
      {
        title: 'Detach & switch sessions',
        rows: [
          { k: 'prefix d', d: 'Detach, leaving everything running', n: 'Come back later with <code>tmux a</code>.' },
          { k: 'prefix s', d: 'Pick a session from a list' },
          { k: 'prefix ( / prefix )', d: 'Previous / next session' },
          { k: 'prefix L', d: 'Switch to the last session you used' },
          { k: 'prefix $', d: 'Rename the session' },
        ],
      },
      {
        title: 'Windows',
        note: 'Like tabs. They’re listed in the green bar at the bottom.',
        rows: [
          { k: 'prefix c', d: 'New window' },
          { k: 'prefix n / prefix p', d: 'Next / previous window' },
          { k: 'prefix 0-9', d: 'Go to window 0 to 9' },
          { k: 'prefix l', d: 'Go back to the last window you used' },
          { k: 'prefix w', d: 'Pick a window from a list' },
          { k: 'prefix ,', d: 'Rename the window' },
          { k: 'prefix &', d: 'Close the window', n: 'Asks first. Press y to confirm.' },
        ],
      },
      {
        title: 'Panes',
        note: 'Splits inside a window.',
        rows: [
          { k: 'prefix %', d: 'Split right' },
          { k: 'prefix "', d: 'Split down' },
          { k: 'prefix arrows', d: 'Go to the pane in that direction', n: 'For half a second afterwards, arrows keep moving between panes without the prefix.' },
          { k: 'prefix o', d: 'Go to the next pane' },
          { k: 'prefix ;', d: 'Go back to the last pane you used' },
          { k: 'prefix z', d: 'Zoom the pane to fill the window', n: 'Press again to put it back.' },
          { k: 'prefix ctrl+arrows', d: 'Resize the pane one cell at a time', n: 'On a Mac, Mission Control uses ⌃ with the arrows. Turn that off in System Settings → Keyboard → Keyboard Shortcuts.' },
          { k: 'prefix alt+arrows', d: 'Resize the pane five cells at a time', n: 'On a Mac, your terminal must send Option as Alt.' },
          { k: 'prefix space', d: 'Switch to the next layout' },
          { k: 'prefix { / prefix }', d: 'Swap with the previous / next pane' },
          { k: 'prefix q', d: 'Show pane numbers', n: 'Press a number while they show to jump to that pane.' },
          { k: 'prefix !', d: 'Move the pane into its own window' },
          { k: 'prefix x', d: 'Close the pane', n: 'Asks first. Press y to confirm.' },
        ],
      },
      {
        title: 'Scroll & copy',
        note: 'tmux keeps its own scrollback. Copy mode lets you scroll, search and copy it. These are the default keys. If your <code>$EDITOR</code> is vi or Vim, tmux uses the vi keys in the next section instead.',
        rows: [
          { k: 'prefix [', d: 'Enter copy mode to scroll back' },
          { k: 'prefix pgup', d: 'Enter copy mode and scroll up a page' },
          { k: 'pgup / pgdn', d: 'Scroll up / down a page', n: 'The arrow keys move one line at a time.' },
          { k: 'ctrl+r / ctrl+s', d: 'Search up / down', n: 'Press n to find the next match.' },
          { k: 'ctrl+space', d: 'Start selecting' },
          { k: 'alt+w', d: 'Copy the selection', n: 'This also leaves copy mode. On a Mac, your terminal must send Option as Alt.' },
          { k: 'q', d: 'Leave copy mode' },
          { k: 'prefix ]', d: 'Paste what you copied' },
        ],
      },
      {
        title: 'Copy mode with vi keys',
        note: 'Used when <code>mode-keys</code> is set to vi, or your <code>$EDITOR</code> is vi or Vim. Enter copy mode with prefix [ and leave with q, as usual.',
        rows: [
          { k: 'h j k l', d: 'Left, down, up, right' },
          { k: 'ctrl+u / ctrl+d', d: 'Half a page up / down' },
          { k: 'g / G', d: 'Top / bottom of the scrollback' },
          { k: '? / /', d: 'Search up / down' },
          { k: 'n / N', d: 'Next / previous match' },
          { k: 'space', d: 'Start selecting', n: 'Unlike Vim, v doesn’t start a selection unless you add it in Settings.' },
          { k: 'V', d: 'Select whole lines' },
          { k: 'enter', d: 'Copy the selection', n: 'This also leaves copy mode.' },
        ],
      },
      {
        title: 'Get unstuck',
        rows: [
          { k: 'prefix ?', d: 'List every key binding', n: 'Press q to close the list.' },
          { k: 'prefix /', d: 'Find out what a key does', n: 'Then press the key you’re curious about.' },
          { k: 'prefix :', d: 'Type a tmux command', n: 'For example <code>kill-pane</code> or <code>source ~/.tmux.conf</code>.' },
          { k: 'prefix ctrl+b', d: 'Send ctrl+b to the program inside', n: 'Handy in nano and the shell, where ctrl+b moves back a character.' },
          { k: 'prefix t', d: 'Show a big clock', n: 'Press any key to close it.' },
        ],
      },
      {
        title: 'Settings',
        note: 'Put these lines in <code>~/.tmux.conf</code>, then run <code>tmux source ~/.tmux.conf</code> to apply them.',
        rows: [
          { c: 'set -g mouse on', d: 'Scroll, click and resize panes with the mouse' },
          { c: 'set -g history-limit 50000', d: 'Keep more scrollback', n: 'The default is 2,000 lines.' },
          { c: 'set -g base-index 1\nsetw -g pane-base-index 1', d: 'Number windows and panes from 1, to match the keyboard' },
          { c: 'setw -g mode-keys vi', d: 'Use vi keys in copy mode' },
          { c: 'bind -T copy-mode-vi v send -X begin-selection\nbind -T copy-mode-vi y send -X copy-pipe-and-cancel', d: 'Select with v and copy with y, like Vim' },
          { c: 'unbind C-b\nset -g prefix C-a\nbind C-a send-prefix', d: 'Make ctrl+a the prefix, like GNU screen', n: 'Press ctrl+a twice to send a real ctrl+a, to jump to the start of a line.' },
          { c: 'bind r source-file ~/.tmux.conf \\; display "Reloaded"', d: 'Reload this file with prefix r' },
          { c: 'bind | split-window -h -c "#{pane_current_path}"\nbind - split-window -v -c "#{pane_current_path}"', d: 'Split with prefix | and prefix -, in the same folder' },
        ],
      },
    ],
  },
];
