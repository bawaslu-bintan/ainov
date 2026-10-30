import { eveChannel } from "eve/channels/eve";
import { httpBasic, localDev, placeholderAuth } from "eve/channels/auth";

const username = process.env.AINOV_USERNAME;
const password = process.env.AINOV_PASSWORD;

const configuredAuth =
  username && password
    ? httpBasic({ username, password }, { realm: "Ainov" })
    : placeholderAuth();

export default eveChannel({
  auth: [localDev(), configuredAuth],
});
