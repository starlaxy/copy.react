import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Header } from './common/components/Header';
import { Footer } from './common/components/Footer';
import { Top } from './top/pages/Top';
import { ProjectList } from './project/pages/ProjectList';
import { VideoRelationList } from './video/pages/VideoRelationList';
import { Video } from './video/pages/Video';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Header />
                <div id='content'>
                    <Switch>
                        <Route exact path='/' component={ Top } />
                        <Route exact path='/projectlist' component={ ProjectList } />
                        <Route exact path='/videorelationlist/:projectId' component={ VideoRelationList } />
                        <Route exact path='/video/:videoRelationId' component={ Video } />
                    </Switch>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;