package com.badminton.notificationservice.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
@Slf4j
public class AsyncEmailConfig {

@Value("${app.email.pool-size:5}")
private int poolSize;

@Value("${app.email.queue-capacity:50}")
private int queueCapacity;

@Bean(name = "emailExecutor")
public Executor emailExecutor() {
ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
executor.setCorePoolSize(poolSize);
executor.setMaxPoolSize(poolSize);
executor.setQueueCapacity(queueCapacity);
executor.setThreadNamePrefix("email-async-");
executor.setRejectedExecutionHandler((r, exec) ->
log.warn("[EmailQueue] Rejected — queue full (size={}). Task will be dropped. Consider increasing app.email.queue-capacity.", queueCapacity)
);
executor.initialize();
log.info("[AsyncEmail] Thread pool initialized: core={}, max={}, queue={}", poolSize, poolSize, queueCapacity);
return executor;
}
}
