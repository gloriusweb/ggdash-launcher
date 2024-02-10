const DiscordRPC = require("discord-rpc");

const clientId = "1205866839662657597";
const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.on("connected", () => {
    console.log("GGDash RPS подключен!");
});

rpc.on("disconnected", () => {
    console.log("GGDash RPC отключен!");
});

rpc.on("error", (error) => {
    console.error("Произошла ошибка в подключении GGDash RPC:", error);
});

rpc.on("ready", () => {
    console.log("GGDash RPC готов!");
    rpc.setActivity({
        details: "Играет в GGDash!",
        state: "ggdash.fun",
        startTimestamp: Date.now(),
        largeImageKey: "ggdash",
        largeImageText: "ggdash.fun",
    });
});

rpc.login({ clientId }).catch(console.error);

module.exports = rpc;