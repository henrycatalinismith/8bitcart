const React = require("react");
const PropTypes = require("prop-types");

const Function = ({ children, name, params, tldr }) => (
  <article className="help__function">
    <h4 className="help__function-name">
      {name}( <span className="help__function-params">{ params.join(", ") }</span> )
    </h4>
    <p className="help__function-tldr">{tldr}</p>
  </article>
);

export default class Help extends React.Component {
  render() {
    return (
      <div className="help">
        <h1>Help</h1>

        <p>
          8bitc.art is a platform for creating and sharing tiny computer programs called "carts".
          Write your code in the text editor, then press the ▶️ Run button to see what it does.
        </p>

        <p>
          The programming language here is Lua.
          If you've ever written any PICO-8 code, you'll feel right at home:
          it's pretty much the same API!
        </p>

        <h2>
          API Reference: <small>Graphics Functions</small>
        </h2>

        <Function
          name="line"
          params={["x0", "y0", "x1", "y1", "[col]"]}
          tldr="Draws a line between two points">
        </Function>

      </div>
    );
  }
}


