import { Oracle } from "./oracle"

Oracle.Run(undefined, true).catch(err => {
    console.log(err);
});