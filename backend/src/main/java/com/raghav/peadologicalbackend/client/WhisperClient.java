package com.raghav.peadologicalbackend.client;

import com.raghav.peadologicalbackend.dto.WhisperResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.client.MultipartBodyBuilder;

import java.io.File;

@Component
public class WhisperClient {

    private final WebClient webClient;

    public WhisperClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:8000").build();
    }

    public WhisperResponse analyzeAudio(File file) {
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("audio", new FileSystemResource(file));

        return webClient.post()
                .uri("/audio-to-document")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(WhisperResponse.class)
                .block();
    }
}
