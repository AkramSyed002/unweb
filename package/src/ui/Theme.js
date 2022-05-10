import { createTheme } from '@material-ui/core/styles';

const blue = "#5EA0E0";
// const arcWhite = "#fff";
// const arcOrange = "#FFBA60";
// const arcGray = "#868686";
// const arcAqua = "#009c98";

export default createTheme({
    palette: {
        // common:{
        //     blue: `${blue}`,
        //     orange: `${arcOrange}`,
        //     white: `${arcWhite}`,
        // },
        primary: {
            main: blue,
        },
        // secondary:{
        //     main: `${arcAqua}`
        // }
    },
});