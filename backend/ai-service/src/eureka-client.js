import { Eureka } from 'eureka-js-client';

export const initEureka = (appName, port) => {
  const client = new Eureka({
    instance: {
      instanceId: `${appName}:${port}`,
      app: appName.toUpperCase(),
      hostName: process.env.INSTANCE_HOST || 'localhost',
      ipAddr: process.env.INSTANCE_IP || '127.0.0.1',
      port: {
        '$': port,
        '@enabled': true,
      },
      vipAddress: appName.toUpperCase(),
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
      statusPageUrl: `http://${process.env.INSTANCE_HOST || 'localhost'}:${port}/health`,
      healthCheckUrl: `http://${process.env.INSTANCE_HOST || 'localhost'}:${port}/health`,
    },
    eureka: {
      host: process.env.EUREKA_HOST || 'localhost',
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
