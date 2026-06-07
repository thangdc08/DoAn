import { Eureka } from 'eureka-js-client';

export const initEureka = (appName, port) => {
  const client = new Eureka({
    instance: {
      instanceId: `${appName}:${port}`,
      app: appName,
      hostName: appName,
      ipAddr: appName,
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: appName,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      statusPageUrl: `http://${appName}:${port}/api/community/health`,
      healthCheckUrl: `http://${appName}:${port}/api/community/health`,
    },
    eureka: {
      host: process.env.EUREKA_HOST || 'service-registry',
      port: process.env.EUREKA_PORT || 8761,
      servicePath: process.env.EUREKA_SERVICE_PATH || '/eureka/apps/',
    },
  });

  client.start((error) => {
    if (error) {
      console.error(`[Eureka] ${appName} registration failed:`, error);
    } else {
      console.log(`[Eureka] ${appName} registered successfully`);
    }
  });

  return client;
};
