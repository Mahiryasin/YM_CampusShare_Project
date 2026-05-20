package com.ym_project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String token) {
        String subject = "CampusShare - Sifre Sifirlama Dogrulama Kodu";
        String text = "Merhaba,\n\n"
                + "Hesap sifrenizi sifirlamak icin dogrulama kodunuz:\n"
                + "-> " + token + " <-\n\n"
                + "Bu kod 10 dakika boyunca gecerlidir.\n\n"
                + "Eger bu istegi siz yapmadiysaniz lutfen bu e-postayi dikkate almayiniz.\n\n"
                + "CampusShare Ekibi";

        System.out.println("\n========================================================");
        System.out.println("GONDERILEN E-POSTA LOG:");
        System.out.println("Alici: " + toEmail);
        System.out.println("Konu: " + subject);
        System.out.println("Dogrulama Kodu: " + token);
        System.out.println("========================================================\n");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject(subject);
                message.setText(text);
                mailSender.send(message);
                System.out.println("E-posta basariyla gonderildi.");
            } catch (Exception e) {
                System.err.println("E-posta gönderim hatasi (SMTP ayarlanmamis olabilir): " + e.getMessage());
            }
        } else {
            System.out.println("JavaMailSender bulunamadi veya etkin degil, e-posta gonderimi atlandi. (Kod konsola yazdirildi)");
        }
    }
}
