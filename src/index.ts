import { Workspace } from "./workspace/Workspace";

const wp = new Workspace();

wp.run().then(() => {
    wp.loop();
});