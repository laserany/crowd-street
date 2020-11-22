package com.crowdstreet.backend.configuration;

import com.amazonaws.services.lambda.invoke.LambdaFunction;
import com.crowdstreet.backend.dto.DocumentWithCallbackDTO;

public interface ThirdService {
    @LambdaFunction(functionName="third-service")
    String processDocument(DocumentWithCallbackDTO request);
}
