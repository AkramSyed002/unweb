import { Avatar, Grid, Typography } from "@material-ui/core";
import WatchLaterOutlinedIcon from "@material-ui/icons/WatchLaterOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

export const RenderNotification = ({
    classes,
    avatar,
    userName,
    actionMessage,
    action,
    time,
    onCrossClick,
  }) => (
    // TODO: 
    // FIXME: 
    <Grid container className={classes.notificationData}>
      {avatar && (
        <Avatar src={avatar} style={{ width: 43, height: 43, marginRight: 17 }} />
      )}
      <Typography className={classes.notiTitle}>
        <span style={{ fontWeight: 600 }}>{userName}</span> {actionMessage}
        <span style={{ fontWeight: 600, color: "#5EA0E0" }}> {action}</span>
        <br />
        <WatchLaterOutlinedIcon style={{ color: "#C0C0C0", marginBottom: -5 }} />
        <a style={{ color: "#C0C0C0" }}>{time}</a>
      </Typography>
      <CloseOutlinedIcon
        onClick={onCrossClick}
        style={{ marginLeft: "auto", marginTop: 8, cursor: 'pointer' }}
      />
    </Grid>
  );