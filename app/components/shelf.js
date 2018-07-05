const React = require("react");
const PropTypes = require("prop-types");
const classnames = require("classnames");

export default class Shelf extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  render() {
    return (
      <div className="shelf">
        {this.props.children}
      </div>
    );
  }
}


