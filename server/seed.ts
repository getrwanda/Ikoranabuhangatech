import "dotenv/config";
import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

/**
 * Seeds the database with a default admin user
 * This should be run once during initial setup
 */
async function seedAdminUser() {
    try {
        const username = "sudox";
        const defaultPassword = "Admin@2024!";

        // Check if admin user already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (existingUser.length > 0) {
            console.log("✅ Admin user already exists");
            console.log(`Username: ${username}`);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create the admin user
        await db.insert(users).values({
            username,
            password: hashedPassword,
        });

        console.log("✅ Admin user created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 Admin Credentials:");
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("⚠️  IMPORTANT: Change this password immediately after first login!");
        console.log("   Go to: /admin/settings to change your password");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
        console.error("❌ Error seeding admin user:", error);
        throw error;
    }
}

// Run the seed function
seedAdminUser()
    .then(() => {
        console.log("✅ Seeding completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    });
