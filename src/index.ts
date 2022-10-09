import { Workspace } from "./workspace/Workspace";

const wp = new Workspace(document.querySelector('.container'));

wp.run().then(() => {
    wp.loop();
});