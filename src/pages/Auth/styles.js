import { makeStyles } from '@material-ui/core/styles'

export const authStyles = makeStyles((theme) => ({
  rightSide: {
    width: '100%',
    height: '100vh',
  },
  leftContainer: {
    backgroundColor: '#E5E5E5',
  },
  resetPasswordContaier: {
    width: 463,
    height: 550,
    borderRadius: 16,
    padding: 50,
    backgroundColor: '#ffffff',
  },
  resetPasswordTitle: {
    fontWeight: 800,
    fontSize: 34,
    color: '#000',
    paddingBottom: 10,
  },
  textField: {
    // width: 355,
    height: 55,
    marginTop: '1em',
    marginBottom: '1em',
  },
  input: {
    '&:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px white inset',
      //   fontSize: "30px"
    },
  },
  resetButton: {
    backgroundColor: '#5EA0E0',
    color: '#fff',
    marginTop: 24,
    height: 55,
    borderRadius: 4,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#5EA0E0',
      color: '#fff',
    },
  },
  resetButtonDisabled: {
    backgroundColor: '#E5E5E5',
    color: '#707070',
    marginTop: 24,
    height: 55,
    borderRadius: 4,
    textTransform: 'none',
  },
  subText: {
    color: '#C0C0C0',
    fontWeight: 500,
    fontSize: 16,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  errorText: {
    color: '#ED4337',
    fontWeight: 500,
    fontSize: 16,
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  loginRight: {
    width: '100%',
    height: '100vh',
  },

  signInContainer: {
    width: 463,
    height: 465,
    borderRadius: 16,
    padding: 64,
    backgroundColor: '#ffffff',
  },
  signInTitle: {
    fontWeight: 800,
    fontSize: 35,
    color: '#000',
    paddingBottom: 10,
    fontFamily: 'Avenir',
  },

  forgotPassword: {
    fontWeight: 600,
    fontSize: 13,
    color: '#5EA0E0',
    fontFamily: 'Avenir',
    cursor: 'pointer',
  },
  loginButton: {
    backgroundColor: '#5EA0E0',
    color: '#fff',
    marginTop: 24,
    height: 55,
    borderRadius: 4,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#5EA0E0',
      color: '#fff',
    },
  },
  loginButtonDisabled: {
    backgroundColor: '#E5E5E5',
    color: '#707070',
    marginTop: 24,
    height: 55,
    borderRadius: 4,
    textTransform: 'none',
  },
}))
