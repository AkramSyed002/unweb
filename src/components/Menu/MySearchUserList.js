import { Divider, Grid, Typography } from '@material-ui/core'
import React from 'react'

export const MySearchUserList = ({ data, setSelectedRecord }) => {
  return (
    <Grid
      item
      container
      direction="column"
      style={{
        width: 335,
        borderRadius: 10,
        marginTop: 5,
      }}
    >
      {data.map((item) => (
        <div>
          <Grid item container>
            <Typography
              onClick={() => setSelectedRecord(item)}
              style={{
                padding: 5,
                fontFamily: 'Avenir',
              }}
            >
              {item.item_name}
            </Typography>
          </Grid>
          <Divider style={{ margin: 5 }} />
        </div>
      ))}
    </Grid>
  )
}
