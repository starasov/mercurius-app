package mercurius.ut;

import org.mortbay.jetty.handler.AbstractHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;

public class TestResultsHandler extends AbstractHandler {
    private final TestResultsTextTransformer transformer;
    private final String output;

    public TestResultsHandler(TestResultsTextTransformer transformer, String output) {
        this.transformer = transformer;
        this.output = output;
    }

    public void handle(String s, HttpServletRequest request, HttpServletResponse response, int i) throws IOException, ServletException {
        String results = request.getParameter("results");
        if (results != null) {
            generateReport(results);
        }
        
        generateResponse(response);
    }

    private void generateReport(String results) throws IOException {
        String report = transformer.transform(results);

        Writer writer = null;
        try {
            writer = new FileWriter(output, false);
            writer.write(report);
            writer.close();
        } finally {
            if (writer != null) {
                writer.close();
            }
        }
    }

    private void generateResponse(HttpServletResponse response) throws IOException {
        PrintWriter writer = response.getWriter();
        writer.write("OK");
        writer.close();
    }
}
