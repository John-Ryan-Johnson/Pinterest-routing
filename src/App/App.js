import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import './App.scss';
import MyNavbar from '../components/shared/MyNavbar/MyNavbar';
import Home from '../components/pages/Home/Home';
import Auth from '../components/pages/Auth/Auth';
import BoardForm from '../components/pages/BoardForm/BoardForm';
import SingleBoard from '../components/pages/SingleBoard/SingleBoard';
import connection from '../helpers/data/connection';
import PinForm from '../components/pages/PinForm/PinForm';

connection();

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === false ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === true ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;

    return (
      <div className="App">
        <Router>
          <MyNavbar authed={authed} />
          <Switch>
            <PrivateRoute path="/" exact component={Home} authed={authed} />
            <PrivateRoute path="/board/new" exact component={BoardForm} authed={authed} />
            <PublicRoute path="/auth" exact component={Auth} authed={authed} />
            <PrivateRoute path="/board/:boardId" exact component={SingleBoard} authed={authed}/>
            <PrivateRoute path="/board/:boardId/pin/new" exact component={PinForm} authed={authed} />
            <PrivateRoute path="/board/:boardId/edit" exact component={BoardForm} authed={authed}/>
            <PrivateRoute path="/board/:boardId/pin/:pinId/edit" exact component={PinForm} authed={authed} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
