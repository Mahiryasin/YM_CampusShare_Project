import json
import urllib.request

# Tüm kiralamalar listele
try:
    response = urllib.request.urlopen('http://localhost:8082/api/rentals')
    rentals = json.loads(response.read().decode('utf-8'))
    
    # 2026-05-22 başlangıç tarihli kiralamayı bulma (Mahir arac)
    target = None
    for rental in rentals:
        if rental.get('startDate') == '2026-05-22' and rental.get('status') == 'APPROVED':
            target = rental
            break
    
    if target:
        print(f"✅ Kiralama bulundu!")
        print(f"   ID: {target['id']}")
        print(f"   Ürün ID: {target['itemId']}")
        print(f"   Kiralayan: {target['renterUserId']}")
        print(f"   Sahip: {target['ownerUserId']}")
        print(f"   Durum: {target['status']} -> COMPLETED")
        
        # COMPLETED'ye çevir
        update_data = {
            "itemId": target['itemId'],
            "renterUserId": target['renterUserId'],
            "ownerUserId": target['ownerUserId'],
            "startDate": target['startDate'],
            "endDate": target['endDate'],
            "totalPrice": target['totalPrice'],
            "status": "COMPLETED"
        }
        
        req = urllib.request.Request(
            f"http://localhost:8082/api/rentals/{target['id']}",
            data=json.dumps(update_data).encode('utf-8'),
            headers={"Content-Type": "application/json"},
            method="PUT"
        )
        
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode('utf-8'))
        print(f"\n🎉 Başarıyla COMPLETED'ye çevirildi!")
        print(f"   Yeni Durum: {result['status']}")
    else:
        print("❌ Kiralama bulunamadı")
        
except Exception as e:
    print(f"❌ Hata: {e}")
