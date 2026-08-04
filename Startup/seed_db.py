import sqlite3
import random
import datetime

def seed_db():
    conn = sqlite3.connect("contextops.db")
    c = conn.cursor()
    
    # Check if we already have data
    c.execute("SELECT COUNT(*) FROM ai_logs")
    if c.fetchone()[0] == 0:
        print("Seeding database with realistic initial AI log data...")
        features = ["Executive Summary", "Technical Summary", "Investigation", "Resolution", "Similar Incidents", "Postmortem"]
        models = ["gpt-oss:120b-cloud", "gpt-4", "gpt-4o-mini"]
        
        now = datetime.datetime.now()
        
        for i in range(150):
            feature = random.choice(features)
            model = random.choices(models, weights=[80, 15, 5])[0]
            
            prompt_tokens = random.randint(500, 3000)
            if feature == "Postmortem":
                prompt_tokens = random.randint(4000, 8000)
                
            completion_tokens = random.randint(100, 800)
            latency = random.uniform(1.2, 5.5) * 1000
            cost = (prompt_tokens * 0.000005) + (completion_tokens * 0.000015)
            
            status = random.choices(["Approved", "Auto-Applied", "L3 Blocked"], weights=[85, 10, 5])[0]
            sys_id = f"INC{random.randint(10000, 99999)}"
            
            # Go back up to 7 days
            days_ago = random.uniform(0, 7)
            timestamp = (now - datetime.timedelta(days=days_ago)).strftime("%Y-%m-%d %H:%M:%S")
            
            c.execute("""INSERT INTO ai_logs 
                         (model, feature, prompt_tokens, completion_tokens, latency_ms, cost, status, sys_id, timestamp) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                      (model, feature, prompt_tokens, completion_tokens, latency, cost, status, sys_id, timestamp))
    else:
        print("ai_logs already seeded")
                  
    # Seed system_health
    c.execute("SELECT COUNT(*) FROM system_health")
    if c.fetchone()[0] == 0:
        print("Seeding system_health...")
        health_data = [
            ("Global VPN Gateway", "critical", "98% Latency Spike"),
            ("HR Portal (Workday)", "amber", "Auth Timeout"),
            ("Payment Processing", "healthy", "Operational"),
            ("Active Directory Sync", "healthy", "Operational"),
            ("O365 Mail Transport", "healthy", "Operational"),
            ("SAP ERP Core", "healthy", "Operational")
        ]
        c.executemany("INSERT INTO system_health (service_name, status, detail) VALUES (?, ?, ?)", health_data)
        
    # Seed anomalies
    c.execute("SELECT COUNT(*) FROM anomalies")
    if c.fetchone()[0] == 0:
        print("Seeding anomalies...")
        anomalies_data = [
            ("CPU Spike > 99%", "Server: VMW-HOST-09", "1 minute ago", "critical"),
            ("Anomalous Login Failures", "Service: Cisco AnyConnect", "4 minutes ago", "amber"),
            ("Disk IO Latency > 500ms", "Storage: SAN-LUN-02", "12 minutes ago", "amber"),
            ("Unusual Traffic Volume", "Load Balancer: F5-DMZ-01", "18 minutes ago", "info")
        ]
        c.executemany("INSERT INTO anomalies (title, service, time_ago, severity) VALUES (?, ?, ?, ?)", anomalies_data)

    # Seed monthly metrics
    c.execute("SELECT COUNT(*) FROM monthly_metrics")
    if c.fetchone()[0] == 0:
        print("Seeding monthly_metrics...")
        metrics_data = [
            ("Jan", 380, 110),
            ("Feb", 420, 140),
            ("Mar", 470, 180),
            ("Apr", 520, 230),
            ("May", 550, 290),
            ("Jun", 530, 330),
            ("Jul", 500, 360),
            ("Aug", 480, 400),
            ("Sep", 470, 420),
            ("Oct", 465, 450),
            ("Nov", 475, 470),
            ("Dec", 490, 460)
        ]
        c.executemany("INSERT INTO monthly_metrics (month_name, total_incidents, deflected_incidents) VALUES (?, ?, ?)", metrics_data)

    conn.commit()
    conn.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_db()
