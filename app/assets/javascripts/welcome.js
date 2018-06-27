document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.querySelector('.Cart__textarea');

  const cm = CodeMirror.fromTextArea(textarea, {
    lineNumbers: true,
    //mode: "lua",
    autofocus: true,
    indentWithTabs: false,
    indentSize: 2,
    indentUnit: 1,
    smartIndent: true,
    cursorBlinkRate: 500,
  });
});

