import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from "prop-types";

// import { HashRouter as Router, Route, Link } from "../react-router-dom";
// import { BrowserRouter as Router, Route, Link } from "../react-router-dom";
class BasicExample extends React.Component{
    render(){
        return (
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>

                    <hr />

                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/topics" component={Topics} />
                </div>
            </Router>
        );
    }
}
class Home extends React.Component{
    static contextTypes = {
        router: PropTypes.object
    };

    render(){
        console.log(this.context)
        return (
            <div>
                <h2>Home</h2>
            </div>
        );
    }
}
const About = (props) => {
    return (
  <div>
    <h2>About</h2>
  </div>
)};

const Topics = ({ match }) => {
    // console.log(match);

    return  ( <div>
        <h2>Topics</h2>
        <ul>
            <li>
                <Link to={`${match.url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${match.url}/components`}>Components</Link>
                <Link to={`${match.url}/components/123`}>123</Link>
            </li>
            <li>
                <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
            </li>
        </ul>

        <Route exact path={`${match.url}/:topicId`} component={Topic}/>
        <Route path={`${match.url}/:topicId/123`} render={() => <h3>12345</h3>}/>
        <Route
            exact
            path={match.url}
            render={() => <h3>Please select a topic.</h3>}
        />
    </div>)
};

const Topic = (props) => {

    const { match } = props;
    // console.log(match);

    return (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)};

export default BasicExample;
