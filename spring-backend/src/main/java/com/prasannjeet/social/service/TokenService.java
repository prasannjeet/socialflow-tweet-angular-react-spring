package com.prasannjeet.social.service;

import static com.prasannjeet.social.dto.TwitterTokenBodyHandler.twitterTokenHandler;
import static java.net.http.HttpClient.newHttpClient;
import static java.net.http.HttpRequest.BodyPublishers.ofString;
import static java.net.http.HttpRequest.newBuilder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse.BodyHandler;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.prasannjeet.social.conf.TimetableConfig;
import com.prasannjeet.social.dto.TwitterToken;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private final TimetableConfig timetableConfig;

    public TokenService(TimetableConfig timetableConfig) {
        this.timetableConfig = timetableConfig;
    }

    public TwitterToken getTwitterToken(String keycloakToken) throws URISyntaxException, IOException, InterruptedException {

        ObjectMapper mapper = new ObjectMapper();

        Map<String, String> dataParams = Map.of(
                "client_id", timetableConfig.getKeycloakClientId(),
                "client_secret", timetableConfig.getKeycloakClientSecret(),
                "subject_token", keycloakToken,
                "subject_token_type", "urn:ietf:params:oauth:token-type:access_token",
                "grant_type", "urn:ietf:params:oauth:grant-type:token-exchange",
                "audience", "target-client",
                "requested_issuer", "twitter"
        );

        String form = dataParams.entrySet().stream()
                .map(e -> {
                    try {
                        return e.getKey() + "=" + URLEncoder.encode(e.getValue(), "UTF-8");
                    } catch (UnsupportedEncodingException ex) {
                        throw new RuntimeException(ex);
                    }
                })
                .reduce((a, b) -> a + "&" + b).get();

        URI uri = new URIBuilder()
                .setScheme(timetableConfig.getKeycloakScheme())
                .setHost(timetableConfig.getKeycloakAuthServer())
                .setPort(Integer.parseInt(timetableConfig.getKeycloakAuthPort()))
                .setPath("/realms/"+timetableConfig.getKeycloakRealmName()+"/protocol/openid-connect/token")
                .build();

        HttpClient client = newHttpClient();

        HttpRequest request = newBuilder()
                .uri(uri)
                .headers("Content-Type", "application/x-www-form-urlencoded")
                .POST(ofString(form))
                .build();

        BodyHandler<TwitterToken> responseBodyHandler = twitterTokenHandler(mapper);

        return client.send(request, responseBodyHandler).body();

    }


}
