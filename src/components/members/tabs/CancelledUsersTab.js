import React from 'react'
import { Grid } from '@material-ui/core'
import CancelledUsersTable from './CancelledUsersTable'

const CancelledUsersTab = ({ users, cancelledMembers }) => {
  return (
    <Grid container direction="column">
      <CancelledUsersTable cancelledMembers={cancelledMembers} />
    </Grid>
  )
}

export default CancelledUsersTab

