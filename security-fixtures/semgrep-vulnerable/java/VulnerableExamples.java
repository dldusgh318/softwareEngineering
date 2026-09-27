package security.fixtures.semgrep;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Intentionally vulnerable snippets used only as Semgrep scan fixtures.
 *
 * <p>This class is outside every production source root and must never be
 * compiled, imported, deployed, or executed.</p>
 */
final class VulnerableExamples {

  private VulnerableExamples() {
  }

  static ResultSet sqlInjection(Connection connection, HttpServletRequest request)
      throws SQLException {
    String requestParameter = request.getParameter("name");
    Statement statement = connection.createStatement();
    String query = "SELECT * FROM attendees WHERE name = '" + requestParameter + "'";
    return statement.executeQuery(query);
  }

  static Process commandInjection(HttpServletRequest request) throws IOException {
    String requestParameter = request.getParameter("command");
    return Runtime.getRuntime().exec(requestParameter);
  }

  static String pathTraversal(HttpServletRequest request) throws IOException {
    String requestParameter = request.getParameter("fileName");
    File requestedFile = new File("/tmp/semgrep-fixture", requestParameter);
    return Files.readString(requestedFile.toPath());
  }

  static byte[] weakCryptography(String requestParameter)
      throws NoSuchAlgorithmException {
    MessageDigest digest = MessageDigest.getInstance("MD5");
    return digest.digest(requestParameter.getBytes());
  }

  static void reflectedXss(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    String requestParameter = request.getParameter("displayName");
    response.getWriter().write(
        "<html><body><h1>" + requestParameter + "</h1></body></html>");
  }
}
