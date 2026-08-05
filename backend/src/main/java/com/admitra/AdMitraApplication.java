package com.admitra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AdMitraApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdMitraApplication.class, args);
    }
}
