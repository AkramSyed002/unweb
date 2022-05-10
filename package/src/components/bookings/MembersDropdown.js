import React from 'react'
import { Avatar, Grid, Typography } from '@material-ui/core'

const MembersDropdown = ({ members, setMember }) => {
  return (
    <Grid style={{ width: '25%', backgroundColor: 'white', borderWidth: 1 }}>
      {members &&
        members.map((el, i) => (
          <div
            key={i.toString()}
            onClick={() => setMember(i)}
            style={{ display: 'flex', width: 335, cursor: 'pointer' }}
          >
            <Avatar
              src={el.profile_image_URL}
              style={{ width: 50, height: 50 }}
            />
            <Typography
              style={{
                padding: 15,
                fontSize: 16,
                fontWeight: 500,
                color: '#727272',
                fontFamily: 'Avenir',
              }}
            >{`${el.first_name} ${el.last_name}`}</Typography>
          </div>
        ))}
    </Grid>
  )
}

export default MembersDropdown
