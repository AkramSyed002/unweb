import React, { Fragment, useState } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import { InAppChatData } from "../../../constants";

const RenderReceiverMessage = ({ classes, message, time }) => (
  <Grid
    item
    container
    direction="column"
    alignItems="flex-start"
    style={{ marginLeft: 40, marginRight: 22 }}
  >
    <Grid
      item
      container
      alignItems="center"
      className={classes.receiverMessageContainer}
    >
      <Typography style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
        {message}
      </Typography>
    </Grid>
    <Typography className={classes.dateLabel}>{time}</Typography>
  </Grid>
);

const RenderSenderMessage = ({ classes, message, time }) => (
  <Grid
    item
    container
    direction="column"
    alignItems="flex-end"
    style={{ marginLeft: 40, marginRight: 22 }}
  >
    <Grid
      item
      container
      alignItems="center"
      className={classes.senderMessageContainer}
    >
      <Typography style={{ color: "#202857", fontSize: 14, fontWeight: 500 }}>
        {message}
      </Typography>
    </Grid>
    <Grid item container justifyContent="center">
      <Typography className={classes.dateLabel}>{time}</Typography>
    </Grid>
  </Grid>
);

const InAppChat = ({ classes }) => {
  const [message, setMessage] = useState("");

  const handleMessageSend = () => {
    let temp = new Date();
    temp.getHours();
    temp.getMinutes();
    if (message.length > 0) {
      InAppChatData.push({
        time: `${temp.getHours()}:${temp.getMinutes()}`,
        senderMessage: message,
      });
      setMessage("");
    }
  };

  return (
    <Fragment>
      <Grid item container>
        <Button variant="text" className={classes.markasReadButton}>
          Mark all as Read
        </Button>
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        className={classes.notificationContainer}
      >
        <Typography className={classes.title}>
          Unread <span className={classes.notifications}>2</span>
        </Typography>
        <Grid item container justifyContent="center">
          <Typography className={classes.dateLabel}>Thur, Jul 15</Typography>
        </Grid>
        {InAppChatData.map((chat, index) =>
          chat.receiverMessage ? (
            <RenderReceiverMessage
              classes={classes}
              message={chat.receiverMessage}
              time={chat.time}
            />
          ) : chat.senderMessage ? (
            <RenderSenderMessage
              classes={classes}
              message={chat.senderMessage}
              time={chat.time}
            />
          ) : undefined
        )}

        <Grid
          item
          container
          style={{ marginLeft: 40, marginRight: 22, marginTop: 200 }}
          alignItems="center"
        >
          <TextField
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message... "
            style={{ width: "96%", borderRadius: 8, backgroundColor: "#fff" }}
            classes={{ root: classes.textf }}
          />
          <SendIcon
            onClick={handleMessageSend}
            className={classes.sendButton}
          />
        </Grid>
      </Grid>
      <Grid>
        <Button variant="text" className={classes.exportCSVButton}>
          Export .CSV
        </Button>
      </Grid>
    </Fragment>
  );
};

export default InAppChat;
