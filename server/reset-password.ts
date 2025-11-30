import "dotenv/config";
import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

/**
 * Resets the admin user password to a known value
 */
async function resetAdminPassword() {
    try {
        const username = "sudox";
        const newPassword = "Admin@2024!";

        // Check if admin user exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.username, username))
            .limit(1);

        if (existingUser.length === 0) {
            console.log("❌ Admin user does not exist. Creating new admin user...");

            // Create new admin user
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.insert(users).values({
                username,
                password: hashedPassword,
            });

            console.log("✅ Admin user created successfully!");
        } else {
            // Update existing user's password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db
                .update(users)
                .set({ password: hashedPassword })
                .where(eq(users.username, username));

            console.log("✅ Admin password reset successfully!");
        }

        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📋 Admin Credentials:");
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${newPassword}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🌐 Login URL: http://localhost:5000/admin/login");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("⚠️  IMPORTANT: Change this password after login!");
        console.log("   Go to: /admin/settings");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    } catch (error) {
        console.error("❌ Error resetting admin password:", error);
        throw error;
    }
}

// Run the reset function
resetAdminPassword()
    .then(() => {
        console.log("✅ Password reset completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Password reset failed:", error);
        process.exit(1);
    });
