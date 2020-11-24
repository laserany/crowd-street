/*
This Configuration class is used to instantiate some beans, enable JDBC sesion and Jasypt encrypted properties!
Good examples provided here are calling AWS as third service and calling the DB. Since Beans are singleton
by default then instantiating them in a singleton bean improves the performance significantly.
 */

package com.crowdstreet.backend.configuration;

import com.amazonaws.auth.*;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.invoke.LambdaInvokerFactory;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.RestTemplate;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Configuration
@EnableEncryptableProperties
@EnableJdbcHttpSession
public class BackendConfiguration extends AbstractHttpSessionApplicationInitializer {

    @Value("${aws.access.key.id}")
    private String awsAccessKeyId;
    @Value("${aws.secret.access.key}")
    private String awsSecretAccessKey;

    //This is to call AWS Lambda. Yes this is actually calling my lambda function in my AWS account
    //However IAM role was created so that it is only authorized to invoke the function.
    //The function does nothing (for simplicity sake) and the access key and secret key are
    //encrypted using Jasypt library
    @Bean
    public ThirdService thirdService() {
        return LambdaInvokerFactory.builder()
                .lambdaClient(AWSLambdaClientBuilder.standard().
                withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(awsAccessKeyId, awsSecretAccessKey))).
                withRegion(Regions.US_EAST_1).build()).build(ThirdService.class);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    //I'm using H2 for storing sessions. However this is not recommended in production.
    //H2 is just for in-memory and we need a real database for persisting the data.
    @Bean
    public EmbeddedDatabase dataSource() {
        return new EmbeddedDatabaseBuilder()
                .setType(EmbeddedDatabaseType.H2)
                .addScripts("org/springframework/session/jdbc/schema-drop-h2.sql",
                            "org/springframework/session/jdbc/schema-h2.sql")
                .build();
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean
    public Connection connection() throws SQLException {
        return DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
    }
}

