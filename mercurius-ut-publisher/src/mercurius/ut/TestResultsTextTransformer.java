package mercurius.ut;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * User: suslik
 * Date: 17.09.2010
 * Time: 7:02:01
 */
public class TestResultsTextTransformer {
    private final String projectBasePath;

    public TestResultsTextTransformer(String projectBasePath) {
        this.projectBasePath = projectBasePath;
    }

    public String transform(String json) {
        Collection<Result> allResults = parseResults(json);
        Collection<Result> failedResults = filterFailedResults(allResults);
        Map<String, Collection<Result>> groupedResults = groupResultsBySuite(allResults);

        StringBuilder builder = new StringBuilder();
        builder.append("TEST RESULTS\n");
        builder.append("============\n\n");

        generateAllTestsReport(builder, groupedResults);
        generateFailedTestsReport(builder, failedResults);
        builder.append("========================\n");
        builder.append(String.format("Total: %d, Failed: %d", allResults.size(), failedResults.size()));

        return builder.toString();
    }

    private Collection<Result> parseResults(String json) {
        Gson gson = new Gson();
        Type collectionType = new TypeToken<Collection<Result>>(){}.getType();
        return gson.fromJson(json, collectionType);
    }

    private Map<String, Collection<Result>> groupResultsBySuite(Collection<Result> allResults) {
        Map<String, Collection<Result>> groupedResults = new LinkedHashMap<String, Collection<Result>>();

        for (Result result : allResults) {
            Collection<Result> suiteResults = groupedResults.get(result.getSuite());
            if (suiteResults == null) {
                suiteResults = new ArrayList<Result>();
                groupedResults.put(result.getSuite(), suiteResults);
            }

            suiteResults.add(result);
        }

        return groupedResults;
    }

    private Collection<Result> filterFailedResults(Collection<Result> results) {
        Collection<Result> failedResults = new ArrayList<Result>();

        for (Result result : results) {
            if (!result.isPassed()) {
                failedResults.add(result);
            }
        }

        return failedResults;
    }

    private void generateAllTestsReport(StringBuilder builder, Map<String, Collection<Result>> groupedResults) {
        for (Collection<Result> results: groupedResults.values()) {
            for (Result result : results) {
                String resultString = result.isPassed() ? "OK" : "FAILED";
                builder.append(String.format("%s.%s: %s%n", result.getSuite(), result.getMethod(), resultString));
            }
        }

        builder.append("\n");
    }

    private void generateFailedTestsReport(StringBuilder builder, Collection<Result> failedTests) {
            for (Result result : failedTests) {
                File source = new File(projectBasePath, result.getSource());
                builder.append("---------------------------------------\n");
                builder.append(String.format("%s.%s: %s%n    %s:1%n%n", result.getSuite(), result.getMethod(), result.getMessage(), source));
            }
    }
}
