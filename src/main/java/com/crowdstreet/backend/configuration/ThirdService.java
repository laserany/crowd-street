package com.crowdstreet.backend.configuration;

import com.amazonaws.services.lambda.invoke.LambdaFunction;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;

//this interface is used to call AWS Lambda.
//more details on why and how at https://aws.amazon.com/blogs/developer/invoking-aws-lambda-functions-from-java/
public interface ThirdService {
    @LambdaFunction(functionName="third-service")
    void processDocument(DocumentWithCallbackDTO request) throws Exception;
}
