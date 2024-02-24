const DiscordRPC = require("discord-rpc");

const clientId = "1205866839662657597";
const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.on("connected", () => {
    console.log("GGDash RPC connected!");
});

rpc.on("disconnected", () => {
    console.log("GGDash RPC disconnected!");
});

rpc.on("error", (error) => {
    console.error("Error:", error);
});

rpc.on("ready", () => {
    console.log("GGDash RPC ready!");
    rpc.setActivity({
        details: "Играет в GGDash!",
        state: "ggdash.fun",
        startTimestamp: Date.now(),
        largeImageKey: "ggdash",
        largeImageText: "ggdash.fun",
    }).then();
});

rpc.login({ clientId }).catch(console.error);

module.exports = rpc;