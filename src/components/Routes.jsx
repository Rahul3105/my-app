import { Route, Switch , Redirect } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
export function Routes({handleOpen}) {
    return (
        <>
            <Switch>
                <Route path='/' exact = {true}>
                    <Login handleOpen={ handleOpen }/>
                </Route>
                <Route path='/login'>
                    <Login handleOpen={ handleOpen }/>
                </Route>
                <Route path='/signup'>
                    <Signup handleOpen={ handleOpen }/>
                </Route>
                <PrivateRoutes path='/my-drive' exact = {true} redirectPath={'/signup'}>
                    <Home handleOpen={ handleOpen }/>
                </PrivateRoutes>
                <PrivateRoutes path="/my-drive/:id" redirectPath={'/signup'} exact = {true}>
                    <Home handleOpen={ handleOpen }/>
                </PrivateRoutes>
                <Route>
                    <h1>Not found</h1>
                </Route>
            </Switch>
        </>
    )   
}

const PrivateRoutes = ({ path, children , redirectPath, exact= false}) => {
    const isAuth = localStorage.getItem('user_token');
    if (!isAuth)  return <Redirect exact={ exact } to={redirectPath}></Redirect>
    return (
        <Route path={path}>{children}</Route>
    )
}