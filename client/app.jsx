const { React, ReactDOM, PropTypes } = window;

const Page = {
    NotFound: 0,
    Index: 1,
    List: 2,
    House: 3,
    AddHouse: 4,
};

function extractStateFromUrl() {
    const params = {
        page: Page.NotFound,
        house: null,
    };

    const path = window.location.pathname;

    if (/^\/$/.test(path)) {
        params.page = Page.Index;
    } else if (/^\/houses$/.test(path)) {
        params.page = Page.List;
    } else if (/^\/house\/(\d+)$/.test(path)) {
        const [, id] = path.match(/^\/house\/(\d+)$/);
        params.page = Page.House;
        params.house = parseInt(id, 10);
    } else if (/^\/add$/.test(path)) {
        params.page = Page.AddHouse;
    }

    return params;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = extractStateFromUrl();
    }

    changePage(newPage) {
        this.setState({ page: newPage }, () => {
            this.updateUrl();
        });
    }

    updateUrl() {
        const { page, house } = this.state;

        let url = '/';

        if (page === Page.Index) {
            url = '/';
        } else if (page === Page.List) {
            url = '/houses';
        } else if (page === Page.AddHouse) {
            url = '/add';
        } else if (page === Page.House) {
            url = `/house/${house}`;
        }

        window.history.replaceState(null, null, url);
    }

    showHouse(id) {
        this.setState(
            {
                house: id,
            },
            () => {
                this.changePage(Page.House);
            }
        );
    }

    render() {
        const { page, house } = this.state;

        return (
            <React.Fragment>
                <Header
                    activePage={page}
                    changePage={this.changePage.bind(this)}
                />

                {page === Page.Index && <Index />}
                {page === Page.List && (
                    <List showHouse={this.showHouse.bind(this)} />
                )}
                {page === Page.House && <House id={house} />}
                {page === Page.AddHouse && <AddHouse />}
                {page === Page.NotFound && (
                    <div>
                        <h1>404</h1>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

function Header(props) {
    return (
        <div className="nav">
            <ul>
                <li>
                    <NavLink {...props} page={Page.Index} label="Home" />
                </li>
                <li>
                    <NavLink {...props} page={Page.List} label="Houses" />
                </li>
                <li>
                    <NavLink
                        {...props}
                        page={Page.AddHouse}
                        label="Add house"
                    />
                </li>
            </ul>
        </div>
    );
}

Header.propTypes = {
    activePage: PropTypes.oneOf(Object.values(Page)).isRequired,
    changePage: PropTypes.func.isRequired,
};

function NavLink(props) {
    return (
        <a
            className={`nav--link ${
                props.page === props.activePage ? 'active' : ''
            }`}
            onClick={() => props.changePage(props.page)}
        >
            {props.label}
        </a>
    );
}

NavLink.propTypes = {
    page: PropTypes.oneOf(Object.values(Page)).isRequired,
    activePage: PropTypes.oneOf(Object.values(Page)).isRequired,
    label: PropTypes.string.isRequired,
    changePage: PropTypes.func.isRequired,
};

function Index() {
    return (
        <div>
            <h2>Home Page</h2>
        </div>
    );
}

function fetchHouses() {
    return fetch('/api/houses').then(res => res.json());
}

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            error: null,
            loading: false,
        };
    }

    componentDidMount() {
        this.setState({
            error: null,
            loading: true,
        });

        fetchHouses()
            .then(data => {
                this.setState({
                    items: data,
                    error: null,
                    loading: false,
                });
            })
            .catch(err => {
                this.setState({
                    error: err.message,
                    loading: false,
                });
            });
    }

    render() {
        const { items, error, loading } = this.state;

        if (error) {
            return <div>{error}</div>;
        }

        if (loading) {
            return <div>loading</div>;
        }

        if (!items.length) {
            return <div>No items</div>;
        }

        return (
            <div className="houses">
                <h2>Houses</h2>
                {items.map(item => (
                    <div
                        onClick={() => this.props.showHouse(item.id)}
                        className="houses--item"
                        key={item.id}
                    >
                        house {item.id}
                    </div>
                ))}
            </div>
        );
    }
}

List.propTypes = {
    showHouse: PropTypes.func.isRequired,
};

function fetchHouse(id) {
    return fetch(`/api/house/${id}`).then(res => res.json());
}

class House extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            error: null,
            loading: false,
        };
    }

    componentDidMount() {
        const { id } = this.props;

        this.setState({
            error: null,
            loading: true,
        });

        fetchHouse(id)
            .then(data => {
                this.setState({
                    data,
                    error: data.error ? data.error : null,
                    loading: false,
                });
            })
            .catch(err => {
                this.setState({
                    error: err.message,
                    loading: false,
                });
            });
    }

    render() {
        const { data, error, loading } = this.state;

        if (error) {
            return <div>{error}</div>;
        }

        if (loading) {
            return <div>loading</div>;
        }

        if (!data) {
            return <div>No data</div>;
        }

        return (
            <div className="house">
                <h2>House {data.id} details:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        );
    }
}

House.propTypes = {
    id: PropTypes.number.isRequired,
};

function addHouse(data) {
    return fetch(`/api/contribute`, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
    }).then(res => res.json());
}

class AddHouse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            price: 0,
            description: '',
            loading: false,
            error: null,
            added: null,
        };
    }

    handleChange(e) {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        const houseData = {
            price: this.state.price,
            description: this.state.description,
        };

        this.setState({
            loading: true,
        });

        addHouse(houseData)
            .then(data => {
                const newState = {
                    loading: false,
                };

                if (data.error) {
                    newState.error = data.error;
                } else {
                    newState.error = null;
                    newState.price = 0;
                    newState.description = '';
                    newState.error = null;
                    newState.added = data;
                }

                this.setState(newState);
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: JSON.stringify(err),
                });
            });
    }

    render() {
        const { price, description, added, loading, error } = this.state;

        if (added) {
            return (
                <div>
                    <h2>Item was added</h2>
                    <pre>{JSON.stringify(added, null, 2)}</pre>
                    <button
                        type="button"
                        onClick={() => {
                            this.setState({ added: null });
                        }}
                    >
                        Add more
                    </button>
                </div>
            );
        }

        return (
            <form className="form" onSubmit={this.handleSubmit.bind(this)}>
                {loading && <div className="form--loader">Submitting...</div>}

                <h2>Add new House</h2>

                <div className="form--row">
                    <label htmlFor="price">Price:</label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        name="price"
                        autoComplete="off"
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                <div className="form--row">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        name="description"
                        autoComplete="off"
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
                {error && (
                    <div className="form--row">
                        <div className="form--error">{error}</div>
                    </div>
                )}
                <div className="form--row">
                    <button type="submit">Submit</button>
                </div>
            </form>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
