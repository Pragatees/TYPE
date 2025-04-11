// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/pages/login";
import Signup from "./components/pages/signup";
import Profile from "./components/pages/profile";
import Home from "./components/pages/home";
import HowToPlay from "./components/pages/howtoplay";
import Rules from "./components/pages/rules";
import Levels from "./components/pages/levels";
import L1 from "./components/pages/level1";
import L2 from "./components/pages/level2";
import L3 from "./components/pages/level3";
import L4 from "./components/pages/level4";
import L5 from "./components/pages/level5";
import L6 from "./components/pages/level6";
import L7 from "./components/pages/level7";
import L8 from "./components/pages/level8";
import L9 from "./components/pages/level9";
import L10 from "./components/pages/level10";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/home" component={Home} />
        <Route path="/hp" component={HowToPlay} />
        <Route path="/rules" component={Rules} />
        <Route path="/levels" component={Levels} />
        <Route path="/l1" component={L1} />
        <Route path="/l2" component={L2} />
        <Route path="/l3" component={L3} />
        <Route path="/l4" component={L4} />
        <Route path="/l5" component={L5} />
        <Route path="/l6" component={L6} />
        <Route path="/l7" component={L7} />
        <Route path="/l8" component={L8} />
        <Route path="/l9" component={L9} />
        <Route path="/l10" component={L10} />
      </Switch>
    </Router>
  );
};

export default App;
