import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'

import AppLayout from './components/layout/AppLayout'

import Theme from './ui/Theme'
import Login from './pages/Auth/Login'
import ResetPassword from './pages/Auth/ResetPassword'
import Restaurants from './pages/Restaurants/Restaurants'
import ManageRestaurant from './pages/Restaurants/ManageRestaurant'
import ManageAdmin from './pages/Restaurants/ManageAdmin'
import Members from './pages/Members/Members'
import ManageMember from './pages/Members/ManageMember'
import MemberProfile from './pages/Members/MemberProfile'
import Bookings from './pages/Bookings/Bookings'
import ManageMenu from './pages/Menu/ManageMenu'
import SendResetPassword from './pages/Auth/SendResetPassword'
import ResetPasswordSuccess from './pages/Auth/ResetPasswordSuccess'
import Notifications from './pages/Notifications/Notifications'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ROUTES } from './constants/routes'
import { AppProvider } from './context/AppContext'
import { PrivateRoute } from './components/routes/PrivateRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Settings } from './pages/Settings/Settings'
import { PublicRoute } from './components/routes/PublicRoute'
import 'react-phone-input-2/lib/style.css'
import { onMessageListener } from './firebase/services'
import { useEffect, useState } from 'react'
import { SnackbarAlert } from './components/SnackbarAlert'
import { Analytics } from './pages/Analytics/Analytics'

function App() {
  const [show, setShow] = useState(false)
  const [notification, setNotification] = useState({ title: '', body: '' })

  const { currentAuth, currentUser } = useAuth()

  useEffect(() => {
    if (currentAuth) {
    }
  }, [currentAuth])

  onMessageListener()
    .then((payload) => {
      new Notification(payload.notification.body)
      setShow(true)
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      })
    })
    .catch((err) => console.log('failed: ', err))

  const handleClose = () => {
    setShow(false)
    setNotification({ title: '', body: '' })
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          <SnackbarAlert
            visible={show}
            onClose={handleClose}
            text={notification.body}
            type="info"
          />
          <Switch>
            {/* <PrivateRoute exact path="/" component={() => "Main"} /> */}
            <Route exact path="/">
              <Redirect to={ROUTES.DASHBOARD_MANAGE_REST} />
            </Route>
            <PublicRoute exact component={Login} path={ROUTES.AUTH_LOGIN} />
            <PublicRoute
              exact
              component={ResetPassword}
              path={ROUTES.AUTH_RESET_PASSWORD}
            />
            <PublicRoute
              exact
              component={SendResetPassword}
              path={ROUTES.AUTH_SEND_RESET_PASSWORD}
            />
            <PublicRoute
              exact
              component={ResetPasswordSuccess}
              path={ROUTES.AUTH_RESET_PASSWORD_SUCCESS}
            />

            <PrivateRoute
              component={Restaurants}
              path={ROUTES.DASHBOARD_MANAGE_REST}
              exact
            />
            <PrivateRoute
              component={ManageRestaurant}
              path={ROUTES.DASHBOARD_ADD_REST}
              exact
            />
            <PrivateRoute
              component={ManageRestaurant}
              path={ROUTES.DASHBOARD_VIEW_REST}
              exact
            />
            <PrivateRoute
              component={ManageAdmin}
              path={ROUTES.DASHBOARD_ADD_ADMIN}
              exact
            />
            <PrivateRoute
              component={ManageAdmin}
              path={ROUTES.DASHBOARD_VIEW_ADMIN}
              exact
            />
            <PrivateRoute
              component={Members}
              path={ROUTES.MEMBER_MANAGE}
              exact
            />
            <PrivateRoute
              component={ManageMember}
              path={ROUTES.MEMBER_ADD}
              exact
            />
            <PrivateRoute
              component={ManageMember}
              path={ROUTES.MEMBER_VIEW}
              exact
            />
            <PrivateRoute
              component={MemberProfile}
              path={ROUTES.MEMBER_PROFILE}
              exact
            />

            <PrivateRoute path="/dashboard/manage-bookings" exact>
              <AppLayout>
                <Bookings />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path="/dashboard/manage-menu" exact>
              <AppLayout>
                <ManageMenu />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path="/dashboard/manage-notifications" exact>
              <AppLayout>
                <Notifications />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path="/dashboard/manage-settings" exact>
              <AppLayout>
                <Settings />
              </AppLayout>
            </PrivateRoute>
            <PrivateRoute path="/dashboard/manage-analytics" exact>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </PrivateRoute>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default () => (
  <AuthProvider>
    <AppProvider>
      <App />
    </AppProvider>
  </AuthProvider>
)
