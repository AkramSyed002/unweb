import React from 'react'
import { Avatar, Divider, Grid, Typography } from '@material-ui/core'
const MembersDropdown = ({ members, setMember }) => {
  return (
    <Grid
      style={{
        backgroundColor: '#FFFF',
        borderWidth: 1,
        position: 'absolute',
        top: 150,
        zIndex: 1000,
        padding: 10,
        overflow: 'scroll',
        height: 350,
        border: '1px solid #e0e0e0',
        borderRadius: 8
      }}
    >
      {members &&
        members.map((el, i) => (
          <div
            style={{
              width: 315,
              overflowY: 'hidden',
            }}
          >
            <div
              key={i.toString()}
              onClick={() => setMember(i)}
              style={{
                display: 'flex',
                width: 315,
                cursor: 'pointer',
                backgroundColor: '#FFF',
                height: 50,
                direction: 'column',
              }}
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
            <Divider style={{ margin: 5 }} />
          </div>
        ))}
    </Grid>
  )
}
export default MembersDropdown
