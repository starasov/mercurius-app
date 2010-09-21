package mercurius.ut;

import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.ContextHandler;

import java.util.Arrays;

public class Main {
    public static void main(String[] args) throws Exception {
        if (args.length != 2) {
            System.out.println("Usage: <project base path> <test results report filename>");
            return;
        }

        String projectBasePath = args[0];
        String reportOutput = args[1]; 

        Server server = new Server(8080);

        ContextHandler context = new ContextHandler();

        context.setContextPath("/publish_results");
        context.setResourceBase(".");
        context.setClassLoader(Thread.currentThread().getContextClassLoader());
        context.setHandler(new TestResultsHandler(new TestResultsTextTransformer(projectBasePath), reportOutput));

        server.setHandler(context);

        server.start();
        server.join();
    }
}
