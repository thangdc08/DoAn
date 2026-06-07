import pkg from "eureka-js-client";
const { Eureka } = pkg;
import {
  eurekaHost,
  eurekaServicePath,
  eurekaPort,
  hostName,
  ipAddress,
} from "./dotenv.js";

function createEurekaClient(port) {
  return new Eureka({
    instance: {
      instanceId: `chat-service:${port}`,
      app: "chat-service",
      hostName: hostName,
      ipAddr: ipAddress,
      port: {
        $: port,
        "@enabled": true,
      },
      vipAddress: "chat-service",
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: eurekaServicePath,
    },
  });
}
export default createEurekaClient;
