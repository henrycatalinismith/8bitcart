const React = require("react");
const PropTypes = require("prop-types");

const Name = require("./name").default;

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Name />
      </header>
    );
  }
}


