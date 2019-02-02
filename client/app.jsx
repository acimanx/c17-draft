class Test extends React.Component {
    constructor(props) {
        this.state = {
            count: 5,
        };
    }

    render() {
        return (
            <div onClick={() => this.setState({ count: this.state.count + 1 })}>
                {this.state.count} <OMG text="wtf " />
            </div>
        );
    }
}

function OMG(props) {
    return <span>{props.text}</span>;
}

ReactDOM.render(<Test />, document.getElementById('root'));
