import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDb {
    public static void main(String[] args) {
        String dbUrl = "jdbc:sqlserver://localhost:1433;encrypt=false;trustServerCertificate=true";
        String user = "sa";
        String pass = "mahir0506093Aa";

        try (Connection conn = DriverManager.getConnection(dbUrl, user, pass);
             Statement stmt = conn.createStatement()) {

            String[] dbs = {
                "CampusShare_UserDB",
                "CampusShare_CatalogDB",
                "CampusShare_RentalDB",
                "CampusShare_ReviewDB"
            };

            for (String db : dbs) {
                try {
                    stmt.executeUpdate("CREATE DATABASE " + db);
                    System.out.println("Created database: " + db);
                } catch (Exception e) {
                    System.out.println("Could not create database " + db + " (may already exist): " + e.getMessage());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
