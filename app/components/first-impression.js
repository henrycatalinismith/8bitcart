const React = require("react");
const PropTypes = require("prop-types");

export default class FirstImpression extends React.Component {
  static propTypes = {
    openEditor: PropTypes.func,
  };

  render() {
    return (
      <div className="first-impression">
        <p className="first-impression__description">
          8bitcart is a <span className="nice">nice</span> place for making
          and sharing <span className="cute">cute</span> little computer
          programs
        </p>
        <ol className="first-impression__checklist">
          <li className="first-impression__onboarding-step">
            <button className="first-impression__action" onClick={this.props.openEditor}>
              make something
            </button>
          </li>
        </ol>
      </div>
    );
  }
}

