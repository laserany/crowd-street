/*
This class tests that the beans are instantiated correctly and that jasypt is decrypting the values
correctly.
 */

package com.crowdstreet.backend.configuration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.RestTemplate;

import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendConfigurationTest {

    @Autowired
    ApplicationContext applicationContext;
    @Autowired
    Environment environment;

    @Test
    public void assertThatThirdServiceBeanExists() {
        assertNotNull(applicationContext.getBean(ThirdService.class));
    }

    @Test
    public void assertThatRestTemplateBeanExists() {
        assertNotNull(applicationContext.getBean(RestTemplate.class));
    }

    @Test
    public void assertThatEmbeddedDatabaseBeanExists() {
        assertNotNull(applicationContext.getBean(EmbeddedDatabase.class));
    }

    @Test
    public void assertThatPlatformTransactionManagerBeanExists() {
        assertNotNull(applicationContext.getBean(PlatformTransactionManager.class));
    }

    @Test
    public void assertThatConnectionBeanExists() {
        assertNotNull(applicationContext.getBean(Connection.class));
    }

    @Test
    public void assertThatSecretValuesAreDecryptedProperly() {
        assertEquals("test-access-key", environment.getProperty("aws.access.key.id"));
        assertEquals("test-secret-key", environment.getProperty("aws.secret.access.key"));
    }
}