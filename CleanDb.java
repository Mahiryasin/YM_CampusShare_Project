import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CleanDb {
    public static void main(String[] args) {
        String dbUrl = "jdbc:sqlserver://localhost:1433;encrypt=false;trustServerCertificate=true";
        String user = "sa";
        String pass = "mahir0506093Aa";

        try (Connection conn = DriverManager.getConnection(dbUrl, user, pass);
             Statement stmt = conn.createStatement()) {

            BufferedReader reader = new BufferedReader(new FileReader("temizle.sql"));
            String line;
            StringBuilder sb = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("--")) {
                    continue;
                }
                
                // Print statements are T-SQL commands but can be skipped in JDBC
                if (line.startsWith("PRINT") || line.startsWith("print")) {
                    continue;
                }

                sb.append(line).append(" ");
                
                // If it ends with semicolon, execute it
                if (line.endsWith(";")) {
                    String sql = sb.toString().trim();
                    System.out.println("Executing: " + sql);
                    try {
                        stmt.executeUpdate(sql);
                    } catch (Exception e) {
                        System.err.println("Error executing: " + sql + " -> " + e.getMessage());
                    }
                    sb.setLength(0); // clear
                }
            }
            reader.close();
            System.out.println("\nDatabase cleanup finished!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
