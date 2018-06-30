const React = require("react");
const PropTypes = require("prop-types");

export default class Textarea extends React.Component {
  static propTypes = {
    onMount: PropTypes.func,
  };

  static defaultProps = {
    onMount: () => {},
  };

  setTextarea = textarea => {
    this.textarea = textarea;
  };

  componentDidMount() {
    this.props.onMount(this.textarea);
  }

  render() {
    return (
      <div className="textarea">
        <textarea ref={this.setTextarea} />
      </div>
    );
  }
}
