import React from 'react';
import { Route, Switch } from 'react-router';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" />
            <Route path="/contact" />
            <Route path="/:article_slug"/>
        </Switch>
    );
}
 

export default Routes;