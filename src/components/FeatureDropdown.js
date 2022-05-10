// import React, { Fragment, useState, useEffect } from "react";
// import {
//     Grid,
//     Paper,
//     TextField,
//     Chip,
//     Typography,
//     Divider,
//     List,
//     ListItem,
//     ListItemAvatar,
//     ListItemText,
//     ClickAwayListener,
// } from "@material-ui/core";
// import DeleteIcon from "@material-ui/icons/Delete";
// import { makeStyles } from "@material-ui/styles";
// import { createRandomRGBA } from "../utils/utils";
// import { useAppContext } from "../context/AppContext";

// const useStyles = makeStyles((theme) => ({
//     label: {
//         marginTop: 16,
//         color: "#C0C0C0",
//         marginBottom: 4,
//         fontFamily: "Avenir",
//         fontStyle: "normal",
//         fontWeight: 500,
//         fontSize: 15,
//     },
//     tagsGrid: {
//         display: "block",
//         // flexWrap: "wrap",
//         marginTop: "50px",
//         // alignItems: "end",
//     },
//     textField: {
//         borderColor: "#E4E4E4",
//         borderRadius: 8,
//         background: "#fff",
//         marginTop: 4,
//     },
//     dropdown: {
//         borderRadius: 10,
//         border: "1px solid",
//         borderColor: "#E4E4E4",
//         padding: theme.spacing(2),
//     },
//     dropdownTypo: {
//         color: "#c4c4c4",
//         fontSize: 14,
//     },
//     divider: {
//         margin: theme.spacing(1.5, 0),
//     },
//     chip: {
//         borderRadius: 8,
//         // cursor: "pointer",
//         // marginTop: theme.spacing(1),
//     },
//     lisItem: {
//         padding: theme.spacing(0),
//     },
//     list: {
//         padding: theme.spacing(0),
//     },
//     icon: {
//         fontSize: 24,
//         color: "#E5E5E5",
//         cursor: "pointer",
//     },
//     textFieldText: {
//         fontSize: 16,
//         fontWeight: 700,
//         // color: '#C0C0C0',
//         color: "#000",
//         fontFamily: "Avenir",
//     },
// }));

// // const defaultOptions = [{ color: '112, 224, 94', label: 'Hello React' }, { color: '94, 160, 224', label: 'Hello Angular' }]

// export const FeatureDropdown = ({
//     inline = true,
//     disabled
// }) => {
//     const { featureOptions, setFeatureOptions } = useAppContext();
//     const classes = useStyles();

//     const [isOpen, setOpen] = useState(false);
//     const [value, setValue] = useState("");
//     const [tags, setTags] = useState([]);

//     const handleValueChange = () => {}



//     return (
//         <Fragment>
//             <Grid container spacing={4}>
//                 <Grid item md={5}>
//                     <Typography className={classes.label} style={{ marginTop: 10 }}>
//                         Features
//                     </Typography>
//                     <TextField
//                         disabled={disabled}
//                         fullWidth
//                         value={value}
//                         variant="outlined"
//                         autoComplete={false}
//                         placeholder="Type something"
//                         onChange={handleValueChange}
//                         onClick={handleMenuToggle}
//                         className={classes.textField}
//                         InputProps={{
//                             className: classes.textFieldText,
//                         }}
//                     />
//                     {isOpen && !disabled && (
//                         <ClickAwayListener onClickAway={handleMenuClose}>
//                             <Paper className={classes.dropdown}>
//                                 <Typography className={classes.dropdownTypo}>
//                                     Create new
//                                 </Typography>
//                                 {Boolean(value) && (
//                                     <Chip
//                                         label={value}
//                                         color="primary"
//                                         onClick={handleOptionCreate}
//                                         className={classes.chip}
//                                         style={{
//                                             background: `rgba(${randomColor}, 0.1)`,
//                                             color: `rgb(${randomColor})`,
//                                         }}
//                                     />
//                                 )}
//                                 <Divider className={classes.divider} />
//                                 <Typography className={classes.dropdownTypo}>
//                                     Existing
//                                 </Typography>
//                                 <List dense={true} className={classes.list}>
//                                     {options.map((option, index) => (
//                                         <ListItem className={classes.lisItem}>
//                                             <ListItemText
//                                                 primary={
//                                                     <Chip
//                                                         label={option.label || option}
//                                                         onClick={() => handleTagAdd(index)}
//                                                         className={classes.chip}
//                                                         style={{
//                                                             background: `rgba(${option.color}, 0.1)`,
//                                                             color: `rgb(${option.color})`,
//                                                         }}
//                                                     />
//                                                 }
//                                             />
//                                             <DeleteIcon
//                                                 className={classes.icon}
//                                                 onClick={() => handleOptionDelete(index)}
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             </Paper>
//                         </ClickAwayListener>
//                     )}
//                 </Grid>
//                 {!inline && <Grid item md={7} />}
//                 <Grid item md={7} className={classes.tagsGrid}>
//                     {tags.map((option, index) => (
//                         <Chip
//                             onDelete={() => handleTagRemove(index)}
//                             label={option?.label || option}
//                             className={classes.chip}
//                             style={{
//                                 background: `rgba(${option?.color}, 0.1)`,
//                                 color: `rgb(${option?.color})`,
//                                 marginRight: 10,
//                                 marginTop: 5
//                             }}
//                         />
//                     ))}
//                 </Grid>
//             </Grid>
//         </Fragment>
//     );
// };

