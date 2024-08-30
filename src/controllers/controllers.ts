import * as upload  from "./Upload";
import * as confirm  from "./Confirm";
import * as list from "./List";

export const Controllers = {
  ...upload,
  ...confirm,
  ...list,
  
};


export * from "./controllers";
